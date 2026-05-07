const HelperModel = require('../models/helper.model');
const ReviewModel = require('../models/review.model');

async function listHelpers(req, res) {
  const helpers = await HelperModel.list(req.query);
  return res.json({ data: helpers });
}

async function getHelperById(req, res) {
  const helper = await HelperModel.findById(req.params.id);
  if (!helper) {
    return res.status(404).json({ message: 'Helper not found.' });
  }
  const reviews = await ReviewModel.listByHelper(helper.id);
  return res.json({ ...helper, reviews });
}

async function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Document file is required.' });
  }
  const helper = await HelperModel.findByUserId(req.user.id);
  if (!helper) {
    return res.status(404).json({ message: 'Helper profile not found.' });
  }
  const updated = await HelperModel.updateDocumentPath(helper.id, req.file.path.replace(/\\/g, '/'));
  return res.json({ message: 'Document uploaded.', helper: updated });
}

module.exports = { listHelpers, getHelperById, uploadDocument };
