const db = require("../config/db_sequelize.js");

module.exports = {

  async index(req, res) {
    try {
      const data = await db.UserFactory.findAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user-factory links", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const link = await db.UserFactory.create(req.body);
      res.status(201).json(link);
    } catch (err) {
      res.status(500).json({ error: "Failed to create link", details: err.message });
    }
  },

  async delete(req, res) {
    try {
      const rows = await db.UserFactory.destroy({
        where: {
          user_id: req.body.user_id,
          factory_id: req.body.factory_id
        }
      });

      if (!rows) return res.status(404).json({ error: "Link not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete link", details: err.message });
    }
  }
};