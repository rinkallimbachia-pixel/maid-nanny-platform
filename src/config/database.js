const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { dbPath } = require('./env');

let dbInstance;

async function getDb() {
  if (!dbInstance) {
    const dir = path.dirname(dbPath);
    fs.mkdirSync(dir, { recursive: true });
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

module.exports = { getDb };
