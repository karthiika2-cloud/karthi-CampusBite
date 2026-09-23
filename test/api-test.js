const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log('🧪 Starting CampusBite Automated System Test Suite...\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✔ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Reason: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await test('Server health check returns ok', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Status not ok');
  });

  // 2. Menu retrieval & search
  await test('Fetch menu and verify seed items (Idli, Dosa, Meals)', async () => {
    const res = await fetch(`${BASE_URL}/menu?category=All`);
    const data = await res.json();
    if (!data.items || data.items.length < 5) throw new Error('Expected at least 5 food items');
    const hasDosa = data.items.some(i => i.name.toLowerCase().includes('dosa'));
    if (!hasDosa) throw new Error('Dosa not found in menu');
  });

  // 3. Category filter
  await test('Category filter returns only Breakfast items', async () => {
    const res = await fetch(`${BASE_URL}/menu?category=Breakfast`);
    const data = await res.json();
    if (data.items.length === 0) throw new Error('No breakfast items found');
    const allBreakfast = data.items.every(i => i.category === 'Breakfast');
    if (!allBreakfast) throw new Error('Returned non-breakfast items');
  });

  // 4. Student login
  let studentToken = '';
  await test('Student login with seeded demo account', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rahul@campus.edu', password: 'student123' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (!data.token || data.user.role !== 'student') throw new Error('Invalid student token');
    studentToken = data.token;
  });

  // 5. Admin login
  let adminToken = '';
  await test('Admin login with seeded manager credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campusbite.com', password: 'admin123' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (!data.token || data.user.role !== 'admin') throw new Error('Admin role missing');
    adminToken = data.token;
  });

  // 6. Create order with mock payment
  let createdOrderNumber = '';
  let createdOrderId = null;
  await test('Student places new food order (mock UPI payment)', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        items: [
          { food_id: 1, quantity: 2 }, // Idli
          { food_id: 8, quantity: 1 }  // Tea
        ],
        payment_method: 'UPI',
        pickup_location: 'Main Canteen Counter 1',
        special_instructions: 'Less sugar in tea'
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (!data.order.order_number) throw new Error('Order number not generated');
    if (data.order.order_status !== 'Order Received') throw new Error('Initial status must be Order Received');
    createdOrderNumber = data.order.order_number;
    createdOrderId = data.order.id;
  });

  // 7. Track Order
  await test(`Track order #${createdOrderNumber} by token`, async () => {
    const res = await fetch(`${BASE_URL}/orders/track/${createdOrderNumber}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (data.order.order_number !== createdOrderNumber) throw new Error('Track order mismatch');
  });

  // 8. Admin metrics & stats
  await test('Admin dashboard stats returns today revenue & orders count', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (data.stats.totalOrders <= 0) throw new Error('Total orders count should be > 0');
    if (data.stats.todayRevenue <= 0) throw new Error('Revenue should be > 0');
  });

  // 9. Admin transitions order to 'Preparing' and 'Ready for Pickup'
  await test(`Admin advances order #${createdOrderNumber} to 'Preparing'`, async () => {
    const res = await fetch(`${BASE_URL}/admin/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Preparing' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (data.order.order_status !== 'Preparing') throw new Error('Status not updated to Preparing');
  });

  // 10. Cancellation rejected when order is already preparing
  await test('Cancellation rejected when kitchen is already preparing', async () => {
    const res = await fetch(`${BASE_URL}/orders/${createdOrderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      }
    });
    if (res.ok) throw new Error('Should not allow cancelling order in Preparing state');
    const data = await res.json();
    if (!data.error.includes('already preparing')) throw new Error(`Unexpected error message: ${data.error}`);
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Start server in background for testing if not already running
const server = require('../server/server.js');
setTimeout(runTests, 1500);
