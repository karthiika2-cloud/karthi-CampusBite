const express = require('express');
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply requireAdmin to all admin routes
router.use(requireAdmin);

// Get Admin Dashboard Overview Metrics
router.get('/stats', (req, res) => {
  try {
    // Total orders
    const totalOrdersRow = db.get('SELECT COUNT(*) as count FROM orders');
    const totalOrders = totalOrdersRow ? totalOrdersRow.count : 0;

    // Pending orders (Received, Confirmed, Preparing)
    const pendingOrdersRow = db.get(
      "SELECT COUNT(*) as count FROM orders WHERE order_status IN ('Order Received', 'Confirmed', 'Preparing')"
    );
    const pendingOrders = pendingOrdersRow ? pendingOrdersRow.count : 0;

    // Ready for pickup
    const readyOrdersRow = db.get(
      "SELECT COUNT(*) as count FROM orders WHERE order_status = 'Ready for Pickup'"
    );
    const readyOrders = readyOrdersRow ? readyOrdersRow.count : 0;

    // Completed orders
    const completedOrdersRow = db.get(
      "SELECT COUNT(*) as count FROM orders WHERE order_status = 'Completed'"
    );
    const completedOrders = completedOrdersRow ? completedOrdersRow.count : 0;

    // Today's Revenue (sum of all non-cancelled orders)
    const revenueRow = db.get(
      "SELECT SUM(total_amount) as total FROM orders WHERE order_status != 'Cancelled'"
    );
    const todayRevenue = revenueRow && revenueRow.total ? Math.round(revenueRow.total) : 0;

    // Popular food item
    const popularItemRow = db.get(`
      SELECT food_name, SUM(quantity) as total_sold
      FROM order_items
      JOIN orders ON order_items.order_id = orders.id
      WHERE orders.order_status != 'Cancelled'
      GROUP BY food_name
      ORDER BY total_sold DESC
      LIMIT 1
    `);
    const popularItem = popularItemRow ? popularItemRow.food_name : 'Butter Masala Dosa';
    const popularItemSold = popularItemRow ? popularItemRow.total_sold : 0;

    // Category distribution
    const categoryStats = db.all(`
      SELECT category, COUNT(*) as count
      FROM food_items
      GROUP BY category
    `);

    // Recent 5 orders preview
    const recentOrders = db.all('SELECT * FROM orders ORDER BY id DESC LIMIT 5');

    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        readyOrders,
        completedOrders,
        todayRevenue,
        popularItem,
        popularItemSold,
        categoryStats,
        recentOrders
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: 'Failed to retrieve admin stats.' });
  }
});

// Get all orders with filter support
router.get('/orders', (req, res) => {
  try {
    const { status, search } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      if (status === 'Pending') {
        query += " AND order_status IN ('Order Received', 'Confirmed', 'Preparing')";
      } else {
        query += ' AND order_status = ?';
        params.push(status);
      }
    }

    if (search && search.trim()) {
      query += ' AND (LOWER(order_number) LIKE ? OR LOWER(student_name) LIKE ? OR LOWER(student_id) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY id DESC';

    const orders = db.all(query, params);

    // Attach items for each order
    const ordersWithItems = orders.map(order => {
      const items = db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      return { ...order, items };
    });

    res.json({ orders: ordersWithItems });
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ error: 'Failed to load orders.' });
  }
});

// Update order status
router.patch('/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Order Received', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // If order was Cash on Pickup and is now marked Completed, mark payment as Paid
    let paymentUpdate = '';
    if (status === 'Completed' && order.payment_status === 'Pending') {
      db.run("UPDATE orders SET payment_status = 'Paid' WHERE id = ?", [id]);
    }

    // Adjust estimated time based on status
    let estTime = order.estimated_time;
    if (status === 'Confirmed') estTime = '12 mins';
    if (status === 'Preparing') estTime = '6 mins';
    if (status === 'Ready for Pickup') estTime = 'Ready Now';
    if (status === 'Completed') estTime = 'Delivered';
    if (status === 'Cancelled') estTime = 'Cancelled';

    db.run(
      'UPDATE orders SET order_status = ?, estimated_time = ? WHERE id = ?',
      [status, estTime, id]
    );

    const updated = db.get('SELECT * FROM orders WHERE id = ?', [id]);
    const items = db.all('SELECT * FROM order_items WHERE order_id = ?', [id]);

    res.json({
      message: `Order #${order.order_number} status updated to ${status}.`,
      order: { ...updated, items }
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

module.exports = router;
