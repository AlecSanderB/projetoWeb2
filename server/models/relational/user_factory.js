module.exports = (sequelize, DataTypes) => {
  const UserFactory = sequelize.define("UserFactory", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    factory_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: "user_factory",
    timestamps: false
  });

  return UserFactory;
};