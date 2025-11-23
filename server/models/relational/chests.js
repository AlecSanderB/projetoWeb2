module.exports = (sequelize, DataTypes) => {
  const Chests = sequelize.define("Chests", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    machine_id: { type: DataTypes.INTEGER, allowNull: false },
    item_name: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_update: { type: DataTypes.DATE },
    coord_x: { type: DataTypes.INTEGER, allowNull: false },
    coord_y: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: "chests",
    timestamps: false
  });

  return Chests;
};