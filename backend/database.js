const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const dataDir = process.env.DB_DIR || (isServerless ? '/tmp/data' : __dirname);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'xploremath.db');
const db = new Database(dbPath);

// create tables if not exist

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
) 
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT,
  author TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

module.exports = db;
