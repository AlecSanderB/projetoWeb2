const db = require("../config/db_sequelize.js");

module.exports = {
  async index(req, res) {
    try {
      const machines = await db.Machines.findAll({ include: db.Chests });
      res.json(machines);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch machines", details: err.message });
    }
  },

  async show(req, res) {
    try {
      const machine = await db.Machines.findByPk(req.params.id, {
        include: [db.Chests, db.MachineHistory],
      });
      if (!machine) return res.status(404).json({ error: "Machine not found" });
      res.json(machine);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch machine", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const machine = await db.Machines.create(req.body);
      res.status(201).json(machine);
    } catch (err) {
      res.status(500).json({ error: "Failed to create machine", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const machine = await db.Machines.findByPk(req.params.id);
      if (!machine) return res.status(404).json({ error: "Machine not found" });
      const updatedData = {
        is_enabled: req.body.is_enabled !== undefined ? req.body.is_enabled : machine.is_enabled,
        last_update: req.body.last_update ? new Date(req.body.last_update) : new Date(),
      };

      await machine.update(updatedData);

      res.json({
        message: "Updated successfully",
        machine,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to update machine", details: err.message });
    }
  },

  async delete(req, res) {
    try {
      const rows = await db.Machines.destroy({ where: { id: req.params.id } });
      if (!rows) return res.status(404).json({ error: "Machine not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete machine", details: err.message });
    }
  },
};