const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

exports.register = async (req, res) => {
  try {
    // Now accepting 'role' from frontend
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Default to 'Farmer' if no role provided
    const userRole = role || 'Farmer'; 

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Pass role to the model
    await User.create(name, email, hashedPassword, userRole);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ message: 'Database access denied. Check DB credentials.' });
    }
    if (err && err.code === 'ER_BAD_DB_ERROR') {
      return res.status(500).json({ message: 'Database not found. Create agricomply_db first.' });
    }
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
};

// ... keep login function same, but ensure it returns the role ...
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Include role in Token and Response
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
        token, 
        user: { id: user.id, name: user.name, role: user.role } 
    });
  } catch (err) {
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ message: 'Database access denied. Check DB credentials.' });
    }
    if (err && err.code === 'ER_BAD_DB_ERROR') {
      return res.status(500).json({ message: 'Database not found. Create agricomply_db first.' });
    }
    res.status(500).json({ message: err.message || 'Login failed' });
  }
};
