module.exports = (sequelize, DataTypes) => {
  const Factories = sequelize.define("Factories", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    coord_x: { type: DataTypes.INTEGER, allowNull: false },
    coord_y: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: "factories",
    timestamps: false
  });

  return Factories;
};