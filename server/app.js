const express = require("express");
const session = require("express-session");
const handlebars = require("express-handlebars");

const middlewares = require("./middlewares/middlewares");
const apiRoutes = require("./routers/api");

const app = express();

app.use(
  session({
    secret: "textosecreto",
    cookie: { maxAge: 30 * 60 * 1000 }
  })
);

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.sessionControl);

app.use("/api", apiRoutes);

app.listen(8081, () => {
  console.log("Servidor no http://localhost:8081");
});