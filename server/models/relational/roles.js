module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define("Roles", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    tableName: "roles",
    timestamps: false
  });

  return Roles;
};