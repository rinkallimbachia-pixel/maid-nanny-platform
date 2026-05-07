const LeaveRequestModel = require('../models/leave-request.model');
const HelperModel = require('../models/helper.model');

async function createLeaveRequest(req, res) {
  const { fromDate, toDate, reason } = req.body;
  const helper = await HelperModel.findByUserId(req.user.id);
  if (!helper) {
    return res.status(404).json({ message: 'Helper profile not found.' });
  }
  const row = await LeaveRequestModel.create({
    helperId: helper.id,
    fromDate,
    toDate,
    reason: reason.trim(),
  });
  return res.status(201).json(row);
}

async function myLeaves(req, res) {
  const helper = await HelperModel.findByUserId(req.user.id);
  if (!helper) {
    return res.status(404).json({ message: 'Helper profile not found.' });
  }
  const rows = await LeaveRequestModel.listByHelper(helper.id);
  return res.json({ data: rows });
}

async function allLeaves(_req, res) {
  const rows = await LeaveRequestModel.listAll();
  return res.json({ data: rows });
}

async function reviewLeave(req, res) {
  const { status } = req.body;
  const row = await LeaveRequestModel.review(req.params.id, status, req.user.id);
  if (!row) {
    return res.status(404).json({ message: 'Leave request not found.' });
  }
  return res.json(row);
}

module.exports = { createLeaveRequest, myLeaves, allLeaves, reviewLeave };
