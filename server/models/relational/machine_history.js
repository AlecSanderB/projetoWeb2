module.exports = (sequelize, DataTypes) => {
  const MachineHistory = sequelize.define("MachineHistory", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    machine_id: { type: DataTypes.INTEGER, allowNull: false },
    is_enabled: { type: DataTypes.BOOLEAN, allowNull: false },
    timestamp: { type: DataTypes.DATE }
  }, {
    tableName: "machine_history",
    timestamps: false
  });

  return MachineHistory;
};