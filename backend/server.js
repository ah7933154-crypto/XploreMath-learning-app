require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database'); 
const jwt = require('jsonwebtoken');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express(); 

// 1. Middleware
app.use(cors({
  origin: [
    'https://xplore-math-learning-app.vercel.app', 
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'mystringishere', 
  resave: false,
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://xplore-math-learning-app-backend.vercel.app/api/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

      if (!user) {
        const insert = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const result = insert.run(name, email, 'OAUTH_USER');
        user = { id: result.lastInsertRowid, name, email };
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// --- ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://xplore-math-learning-app.vercel.app/login' }),
  (req, res) => {
    res.redirect('https://xplore-math-learning-app.vercel.app/home'); 
  }
);

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
      .run(name, email, hashedPassword);
    
    res.status(201).json({ success: true, message: 'Account created!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate a JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.json({ 
        success: true, 
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));