const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("web2", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

const db = {};

db.Roles = require("../models/relational/roles")(sequelize, DataTypes);
db.Users = require("../models/relational/users")(sequelize, DataTypes);
db.Factories = require("../models/relational/factories")(sequelize, DataTypes);
db.Machines = require("../models/relational/machines")(sequelize, DataTypes);
db.Chests = require("../models/relational/chests")(sequelize, DataTypes);
db.ChestHistory = require("../models/relational/chest_history")(sequelize, DataTypes);
db.MachineHistory = require("../models/relational/machine_history")(sequelize, DataTypes);


db.Roles.hasMany(db.Users, { foreignKey: "role_id" });
db.Users.belongsTo(db.Roles, { foreignKey: "role_id" });

db.Factories.hasMany(db.Machines, { foreignKey: "factory_id" });
db.Machines.belongsTo(db.Factories, { foreignKey: "factory_id" });


db.Machines.hasMany(db.Chests, { foreignKey: "machine_id" });
db.Chests.belongsTo(db.Machines, { foreignKey: "machine_id" });

db.Chests.hasMany(db.ChestHistory, { foreignKey: "chest_id" });
db.ChestHistory.belongsTo(db.Chests, { foreignKey: "chest_id" });

db.Machines.hasMany(db.MachineHistory, { foreignKey: "machine_id" });
db.MachineHistory.belongsTo(db.Machines, { foreignKey: "machine_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;