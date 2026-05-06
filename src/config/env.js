const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  dbPath: process.env.DB_PATH || path.join(__dirname, '../../data/maid_nanny.sqlite'),
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
};
