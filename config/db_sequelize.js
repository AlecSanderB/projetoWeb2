const Sequelize = require('sequelize');
const sequelize = new Sequelize('web2_db', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres'
  });

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Usuario = require('../models/relational/usuario.js')(sequelize, Sequelize);
db.Receita = require('../models/relational/receita.js')(sequelize, Sequelize);
db.Categoria = require('../models/relational/categoria.js')(sequelize, Sequelize);
db.Categoria.hasMany(db.Receita, {foreignKey:'categoriaId', onDelete: 'NO ACTION'});
module.exports = db;

