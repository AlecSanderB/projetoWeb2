module.exports = (sequelize, DataTypes) => {
  const ChestHistory = sequelize.define("ChestHistory", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chest_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.DATE }
  }, {
    tableName: "chest_history",
    timestamps: false
  });

  return ChestHistory;
};