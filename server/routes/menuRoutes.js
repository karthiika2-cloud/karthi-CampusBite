const express = require('express');
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all menu items with search and category filtering
router.get('/', (req, res) => {
  try {
    const { category, search, vegOnly, allStatus } = req.query;

    let query = 'SELECT * FROM food_items WHERE 1=1';
    const params = [];

    // Filter out unavailable items unless requested by admin (allStatus=true)
    if (allStatus !== 'true') {
      query += ' AND availability = 1';
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (vegOnly === 'true') {
      query += ' AND is_veg = 1';
    }

    if (search && search.trim()) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term);
    }

    query += ' ORDER BY id DESC';

    const items = db.all(query, params);
    res.json({ items });
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to load menu items.' });
  }
});

// Get categories with item counts
router.get('/categories', (req, res) => {
  try {
    const categories = db.all(`
      SELECT category, COUNT(*) as count 
      FROM food_items 
      WHERE availability = 1 
      GROUP BY category
    `);
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Get single food item by ID
router.get('/:id', (req, res) => {
  try {
    const item = db.get('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch food item.' });
  }
});

// Admin: Add new food item
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, category, description, price, image, is_veg, availability, preparation_time } = req.body;

    if (!name || !category || price === undefined || price === null) {
      return res.status(400).json({ error: 'Name, category, and price are required.' });
    }

    const defaultImage = is_veg ? 
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' : 
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80';

    const result = db.run(
      `INSERT INTO food_items (name, category, description, price, image, is_veg, availability, preparation_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category,
        description ? description.trim() : '',
        parseFloat(price),
        image ? image.trim() : defaultImage,
        is_veg ? 1 : 0,
        availability !== undefined ? (availability ? 1 : 0) : 1,
        preparation_time ? parseInt(preparation_time) : 10
      ]
    );

    const newItem = db.get('SELECT * FROM food_items WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ message: 'Food item added successfully!', item: newItem });
  } catch (err) {
    console.error('Error adding food item:', err);
    res.status(500).json({ error: 'Failed to add food item.' });
  }
});

// Admin: Update food item
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { name, category, description, price, image, is_veg, availability, preparation_time } = req.body;
    const { id } = req.params;

    const existing = db.get('SELECT * FROM food_items WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    db.run(
      `UPDATE food_items 
       SET name = ?, category = ?, description = ?, price = ?, image = ?, is_veg = ?, availability = ?, preparation_time = ?
       WHERE id = ?`,
      [
        name ? name.trim() : existing.name,
        category || existing.category,
        description !== undefined ? description.trim() : existing.description,
        price !== undefined ? parseFloat(price) : existing.price,
        image !== undefined ? image.trim() : existing.image,
        is_veg !== undefined ? (is_veg ? 1 : 0) : existing.is_veg,
        availability !== undefined ? (availability ? 1 : 0) : existing.availability,
        preparation_time !== undefined ? parseInt(preparation_time) : existing.preparation_time,
        id
      ]
    );

    const updated = db.get('SELECT * FROM food_items WHERE id = ?', [id]);
    res.json({ message: 'Food item updated successfully!', item: updated });
  } catch (err) {
    console.error('Error updating food item:', err);
    res.status(500).json({ error: 'Failed to update food item.' });
  }
});

// Admin: Toggle food item availability
router.patch('/:id/availability', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const item = db.get('SELECT * FROM food_items WHERE id = ?', [id]);
    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    const newAvailability = item.availability === 1 ? 0 : 1;
    db.run('UPDATE food_items SET availability = ? WHERE id = ?', [newAvailability, id]);

    res.json({
      message: `Item marked as ${newAvailability === 1 ? 'Available' : 'Unavailable'}.`,
      availability: newAvailability
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle availability.' });
  }
});

// Admin: Delete food item
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const item = db.get('SELECT * FROM food_items WHERE id = ?', [id]);
    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    db.run('DELETE FROM food_items WHERE id = ?', [id]);
    res.json({ message: `"${item.name}" has been deleted from the menu.` });
  } catch (err) {
    console.error('Error deleting food item:', err);
    res.status(500).json({ error: 'Failed to delete food item.' });
  }
});

module.exports = router;
