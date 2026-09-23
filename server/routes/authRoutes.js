const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

// Register new student
router.post('/register', (req, res) => {
  try {
    const { name, student_id, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if email already registered
    const existingEmail = db.get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Check if student_id already registered (if provided)
    if (student_id) {
      const existingStudent = db.get('SELECT id FROM users WHERE student_id = ?', [student_id.trim()]);
      if (existingStudent) {
        return res.status(400).json({ error: 'This Student ID is already registered.' });
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const assignedStudentId = student_id ? student_id.trim() : `STU-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = db.run(
      `INSERT INTO users (name, student_id, email, password, role) VALUES (?, ?, ?, ?, 'student')`,
      [name.trim(), assignedStudentId, email.trim().toLowerCase(), hashedPassword]
    );

    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      student_id: assignedStudentId,
      email: email.trim().toLowerCase(),
      role: 'student'
    };

    const token = signToken(user);
    res.status(201).json({
      message: 'Account created successfully!',
      user,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// Login (Student or Admin)
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.get('SELECT * FROM users WHERE LOWER(email) = ?', [email.trim().toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      student_id: user.student_id,
      email: user.email,
      role: user.role
    };

    const token = signToken(safeUser);
    res.json({
      message: 'Logged in successfully!',
      user: safeUser,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// Get current user profile
router.get('/me', requireAuth, (req, res) => {
  try {
    const user = db.get('SELECT id, name, student_id, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

module.exports = router;
