const db = require("../config/db_sequelize.js");

module.exports = {

  async index(req, res) {
    try {
      const factories = await db.Factories.findAll({
        include: db.Machines
      });
      res.json(factories);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch factories", details: err.message });
    }
  },

  async show(req, res) {
    try {
      const factory = await db.Factories.findByPk(req.params.id, {
        include: db.Machines
      });
      if (!factory) return res.status(404).json({ error: "Factory not found" });
      res.json(factory);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch factory", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const factory = await db.Factories.create(req.body);
      res.status(201).json(factory);
    } catch (err) {
      res.status(500).json({ error: "Failed to create factory", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const [rows] = await db.Factories.update(req.body, { where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Factory not found" });
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update factory", details: err.message });
    }
  },

  async delete(req, res) {
    try {
      const rows = await db.Factories.destroy({ where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Factory not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete factory", details: err.message });
    }
  }
};