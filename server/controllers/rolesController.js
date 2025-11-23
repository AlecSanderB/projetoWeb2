const db = require("../config/db_sequelize.js");

module.exports = {
  async index(req, res) {
    try {
      const roles = await db.Roles.findAll();
      res.json(roles);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch roles", details: err.message });
    }
  },

  async show(req, res) {
    try {
      const role = await db.Roles.findByPk(req.params.id);
      if (!role) return res.status(404).json({ error: "Role not found" });
      res.json(role);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch role", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const role = await db.Roles.create(req.body);
      res.status(201).json(role);
    } catch (err) {
      res.status(500).json({ error: "Failed to create role", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const [rows] = await db.Roles.update(req.body, { where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Role not found" });
      res.json({ message: "Updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update role", details: err.message });
    }
  },

  async delete(req, res) {
    try {
      const rows = await db.Roles.destroy({ where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Role not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete role", details: err.message });
    }
  }
};