module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define('chest', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        name: {
            type: Sequelize.STRING, allowNull: false
        },
        amount: {
            type: Sequelize.INTEGER, allowNull: false
        }
    });
    return Categoria;
}