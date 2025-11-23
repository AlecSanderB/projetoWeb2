const express = require("express");
const session = require("express-session");
const cors = require("cors");

const middlewares = require("./middlewares/middlewares");
const apiRoutes = require("./routers/api");
const authRoutes = require("./routers/auth");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: "textosecreto",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.use(middlewares.sessionControl);

app.use("/api", apiRoutes);

app.listen(8081, () => {
  console.log("Servidor no http://localhost:8081");
});