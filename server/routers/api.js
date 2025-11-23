const express = require("express");
const router = express.Router();

const RolesController = require("../controllers/rolesController");
const UsersController = require("../controllers/usersController");
const FactoriesController = require("../controllers/factoriesController");
const MachinesController = require("../controllers/machinesController");
const ChestsController = require("../controllers/chestsController");
const ChestHistoryController = require("../controllers/chestHistoryController");
const MachineHistoryController = require("../controllers/machineHistoryController");
const UserFactoryController = require("../controllers/userFactoryController");
const AuthController = require("../controllers/authController");

router.get("/roles", RolesController.index);
router.get("/roles/:id", RolesController.show);
router.post("/roles", RolesController.create);
router.put("/roles/:id", RolesController.update);
router.delete("/roles/:id", RolesController.delete);

router.get("/users", UsersController.index);
router.get("/users/:id", UsersController.show);
router.post("/users", UsersController.create);
router.put("/users/:id", UsersController.update);
router.delete("/users/:id", UsersController.delete);

router.get("/factories", FactoriesController.index);
router.get("/factories/:id", FactoriesController.show);
router.post("/factories", FactoriesController.create);
router.put("/factories/:id", FactoriesController.update);
router.delete("/factories/:id", FactoriesController.delete);

router.get("/machines", MachinesController.index);
router.get("/machines/:id", MachinesController.show);
router.post("/machines", MachinesController.create);
router.put("/machines/:id", MachinesController.update);
router.delete("/machines/:id", MachinesController.delete);

router.get("/chests", ChestsController.index);
router.get("/chests/:id", ChestsController.show);
router.post("/chests", ChestsController.create);
router.put("/chests/:id", ChestsController.update);
router.delete("/chests/:id", ChestsController.delete);

router.get("/chest-history", ChestHistoryController.index);
router.get("/chest-history/:id", ChestHistoryController.show);
router.post("/chest-history", ChestHistoryController.create);
router.delete("/chest-history/:id", ChestHistoryController.delete);

router.get("/machine-history", MachineHistoryController.index);
router.get("/machine-history/:id", MachineHistoryController.show);
router.post("/machine-history", MachineHistoryController.create);
router.delete("/machine-history/:id", MachineHistoryController.delete);

router.get("/user-factories", UserFactoryController.index);
router.post("/user-factories", UserFactoryController.create);
router.delete("/user-factories", UserFactoryController.delete);

router.get("/me", AuthController.me);

module.exports = router;