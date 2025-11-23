const db = require("../config/db_sequelize.js");

module.exports = {

  async index(req, res) {
    try {
      const chestId = req.query.chest_id;
      const where = chestId ? { chest_id: chestId } : {};
      const history = await db.ChestHistory.findAll({ where });
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chest history", details: err.message });
    }
  },

  async show(req, res) {
    try {
      const entry = await db.ChestHistory.findByPk(req.params.id);
      if (!entry) return res.status(404).json({ error: "History entry not found" });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch history entry", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const entry = await db.ChestHistory.create(req.body);
      res.status(201).json(entry);
    } catch (err) {
      res.status(500).json({ error: "Failed to create history entry", details: err.message });
    }
  },

  async delete(req, res) {
    try {
      const rows = await db.ChestHistory.destroy({ where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "History entry not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete history entry", details: err.message });
    }
  }
};