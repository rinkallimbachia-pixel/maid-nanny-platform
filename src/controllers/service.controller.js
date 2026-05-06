const ServiceModel = require('../models/service.model');

async function createService(req, res) {
  const { name, description } = req.body;
  const service = await ServiceModel.create(name, description);
  return res.status(201).json(service);
}

async function listServices(_req, res) {
  const services = await ServiceModel.findAll();
  return res.json({ data: services });
}

module.exports = { createService, listServices };
