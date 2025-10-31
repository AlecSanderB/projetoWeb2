const express = require('express');
const db = require('../config/db_sequelize');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerChests = require('../controllers/controllerChests');
const route = express.Router();

/*
db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
}); 
*/

//db.Usuario.create({login:'admin', senha:'1234', tipo:1});


module.exports = route;

//Home
route.get("/home", function (req, res) {
    if (req.session.login) {
        res.render('home')
    }
    else
        res.redirect('/');
});

//Controller Usuario
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/logout", controllerUsuario.getLogout);
route.get("/main", async (req , res) => {
    res.render('layouts/empty');
});
route.get("/usuarioCreate", controllerUsuario.getCreate);
route.post("/usuarioCreate", controllerUsuario.postCreate);
route.get("/usuarioList", controllerUsuario.getList);
route.get("/usuarioUpdate/:id", controllerUsuario.getUpdate);
route.post("/usuarioUpdate", controllerUsuario.postUpdate);
route.get("/usuarioDelete/:id", controllerUsuario.getDelete);
route.get("/listChests", controllerChests.getChests);
route.post("/updateChest", controllerChests.postChests);

route.all('*', (req, res) => {
    res.redirect('/');
});