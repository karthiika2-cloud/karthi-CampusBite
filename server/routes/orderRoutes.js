const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Helper to generate unique order number like CB-1045
function generateOrderNumber() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CB-${randomNum}`;
}

// Helper to generate transaction ID
function generateTxnId(method) {
  const prefix = method === 'UPI' ? 'UPI' : method === 'Card' ? 'TXN-CARD' : 'CASH-COUNTER';
  const code = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}-${code}`;
}

// Create new order (requires student authentication)
router.post('/', requireAuth, (req, res) => {
  try {
    const { items, payment_method, pickup_location, special_instructions } = req.body;
    const user = req.user;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!['UPI', 'Card', 'Cash on Pickup'].includes(payment_method)) {
      return res.status(400).json({ error: 'Valid payment method required (UPI, Card, or Cash on Pickup).' });
    }

    // Verify items against database and calculate total
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const food = db.get('SELECT id, name, price, availability FROM food_items WHERE id = ?', [item.food_id]);
      if (!food) {
        return res.status(400).json({ error: `Food item #${item.food_id} not found.` });
      }
      if (food.availability === 0) {
        return res.status(400).json({ error: `"${food.name}" is currently out of stock.` });
      }

      const qty = parseInt(item.quantity) || 1;
      const itemTotal = food.price * qty;
      totalAmount += itemTotal;

      verifiedItems.push({
        food_id: food.id,
        food_name: food.name,
        price: food.price,
        quantity: qty
      });
    }

    // Optional convenience/packaging fee: ₹5
    const convenienceFee = 5;
    const grandTotal = totalAmount + convenienceFee;

    const orderNumber = generateOrderNumber();
    const transactionId = generateTxnId(payment_method);
    const paymentStatus = payment_method === 'Cash on Pickup' ? 'Pending' : 'Paid';
    const pickupLoc = pickup_location || 'Main Canteen Counter 1';
    const estTime = '12-15 mins';

    // Insert order record
    const result = db.run(
      `INSERT INTO orders (
        order_number, user_id, student_name, student_id, total_amount, 
        payment_method, payment_status, order_status, transaction_id, 
        pickup_location, estimated_time, special_instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Order Received', ?, ?, ?, ?)`,
      [
        orderNumber,
        user.id,
        user.name,
        user.student_id,
        grandTotal,
        payment_method,
        paymentStatus,
        transactionId,
        pickupLoc,
        estTime,
        special_instructions ? special_instructions.trim() : ''
      ]
    );

    const orderId = result.lastInsertRowid;

    // Insert order items
    const insertOrderItem = db.db.prepare(
      `INSERT INTO order_items (order_id, food_id, food_name, price, quantity) VALUES (?, ?, ?, ?, ?)`
    );

    verifiedItems.forEach(item => {
      insertOrderItem.run(orderId, item.food_id, item.food_name, item.price, item.quantity);
    });

    const newOrder = db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    const orderItems = db.all('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        ...newOrder,
        items: orderItems
      }
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }
});

// Get all orders for currently logged in student
router.get('/my-orders', requireAuth, (req, res) => {
  try {
    const orders = db.all(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );

    // Fetch items for each order
    const ordersWithItems = orders.map(order => {
      const items = db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      return { ...order, items };
    });

    res.json({ orders: ordersWithItems });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to retrieve order history.' });
  }
});

// Track order by orderNumber (public or authenticated)
router.get('/track/:orderNumber', (req, res) => {
  try {
    const order = db.get('SELECT * FROM orders WHERE order_number = ?', [req.params.orderNumber.toUpperCase()]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please check your Order ID.' });
    }

    const items = db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.json({ order: { ...order, items } });
  } catch (err) {
    console.error('Error tracking order:', err);
    res.status(500).json({ error: 'Failed to retrieve order tracking info.' });
  }
});

// Cancel order before preparation
router.post('/:id/cancel', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const order = db.get('SELECT * FROM orders WHERE id = ?', [id]);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Ensure the student owns this order (or is admin)
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to cancel this order.' });
    }

    // Check cancellation rule: only allowed before preparation
    if (order.order_status !== 'Order Received' && order.order_status !== 'Confirmed') {
      return res.status(400).json({
        error: `Cannot cancel this order because kitchen is already ${order.order_status.toLowerCase()}.`
      });
    }

    db.run("UPDATE orders SET order_status = 'Cancelled' WHERE id = ?", [id]);

    const updated = db.get('SELECT * FROM orders WHERE id = ?', [id]);
    res.json({
      message: 'Order cancelled successfully. Mock refund initiated.',
      order: updated
    });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
});

module.exports = router;
