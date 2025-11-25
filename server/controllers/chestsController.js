const db = require("../config/db_sequelize.js");
const { nowFormatted } = require("../helpers/dateHelper");

module.exports = {
  async index(req, res) {
    try {
      const chests = await db.Chests.findAll({ include: db.ChestHistory });
      res.json(chests);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chests", details: err.message });
    }
  },

  async show(req, res) {
    try {
      const chest = await db.Chests.findByPk(req.params.id, { include: db.ChestHistory });
      if (!chest) return res.status(404).json({ error: "Chest not found" });
      res.json(chest);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chest", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const chest = await db.Chests.create({
        ...req.body,
        last_update: new Date()
      });
      res.status(201).json({ last_update: nowFormatted() });
    } catch (err) {
      res.status(500).json({ error: "Failed to create chest", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const chest = await db.Chests.findByPk(req.params.id);
      if (!chest) return res.status(404).json({ error: "Chest not found" });

      const updatedData = {
        item_name: req.body.item_name ?? chest.item_name,
        amount: req.body.amount ?? chest.amount,
        coord_x: req.body.coord_x ?? chest.coord_x,
        coord_y: req.body.coord_y ?? chest.coord_y,
        last_update: new Date()
      };

      await chest.update(updatedData);
      res.json({ last_update: nowFormatted() });
    } catch (err) {
      res.status(500).json({ error: "Failed to update chest", details: err.message });
    }
  },

  async updateViaPost(req, res) {
    return module.exports.update(req, res);
  },

  async delete(req, res) {
    try {
      const rows = await db.Chests.destroy({ where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Chest not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete chest", details: err.message });
    }
  },
};