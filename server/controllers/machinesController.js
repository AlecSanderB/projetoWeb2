const db = require("../config/db_sequelize.js");
const { nowFormatted } = require("../helpers/dateHelper");

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
      const machine = await db.Machines.create({
        ...req.body,
        last_update: new Date(),
      });

      const machineWithChildren = await db.Machines.findByPk(machine.id, {
        include: [db.Chests, db.MachineHistory],
      });

      const result = machineWithChildren.get({ plain: true });

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to create machine", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const machine = await db.Machines.findByPk(req.params.id);
      if (!machine) return res.status(404).json({ error: "Machine not found" });

      const updatedData = {
        name: req.body.name ?? machine.name,
        coord_x: req.body.coord_x ?? machine.coord_x,
        coord_y: req.body.coord_y ?? machine.coord_y,
        is_enabled: req.body.is_enabled ?? machine.is_enabled,
        last_update: new Date()
      };

      await machine.update(updatedData);
      res.json({ last_update: nowFormatted() });
    } catch (err) {
      res.status(500).json({ error: "Failed to update machine", details: err.message });
    }
  },

  async updateViaPost(req, res) {
    return module.exports.update(req, res);
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