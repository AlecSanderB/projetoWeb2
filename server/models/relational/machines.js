module.exports = (sequelize, DataTypes) => {
  const Machines = sequelize.define("Machines", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    factory_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    is_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_update: { type: DataTypes.DATE },
    coord_x: { type: DataTypes.INTEGER, allowNull: false },
    coord_y: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: "machines",
    timestamps: false
  });

  return Machines;
};