const express = require('express');
const multer = require('multer');
const path = require('path');
const { listHelpers, getHelperById, uploadDocument } = require('../controllers/helper.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { uploadDir } = require('../config/env');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.get('/', listHelpers);
router.get('/:id', getHelperById);
router.post('/me/document', authMiddleware, requireRole('helper'), upload.single('document'), uploadDocument);

module.exports = router;
