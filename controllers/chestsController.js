const db = require("../config/db_sequelize.js");

module.exports = {

  async index(req, res) {
    try {
      const chests = await db.Chests.findAll();
      res.json(chests);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chests", details: err.message });
    }
  },

  async show(req, res) {
    try {
      const chest = await db.Chests.findByPk(req.params.id, {
        include: db.ChestHistory
      });
      if (!chest) return res.status(404).json({ error: "Chest not found" });
      res.json(chest);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chest", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const chest = await db.Chests.create(req.body);
      res.status(201).json(chest);
    } catch (err) {
      res.status(500).json({ error: "Failed to create chest", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const [rows] = await db.Chests.update(req.body, { where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Chest not found" });
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update chest", details: err.message });
    }
  },

  async delete(req, res) {
    try {
      const rows = await db.Chests.destroy({ where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Chest not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete chest", details: err.message });
    }
  }
};