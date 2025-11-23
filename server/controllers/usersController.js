const db = require("../config/db_sequelize.js");

module.exports = {

  async index(req, res) {
    try {
      const users = await db.Users.findAll({ include: db.Roles });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users", details: err.message });
    }
  },

  async show(req, res) {
    try {
      const user = await db.Users.findByPk(req.params.id, {
        attributes: ['id', 'name', 'role_id']
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const user = await db.Users.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to create user", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const [rows] = await db.Users.update(req.body, { where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "User not found" });
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update user", details: err.message });
    }
  },

  async delete(req, res) {
    try {
      const rows = await db.Users.destroy({ where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "User not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user", details: err.message });
    }
  }
};