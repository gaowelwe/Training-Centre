const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const { logExecutionTime } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/", logExecutionTime, homeController.index);
router.get("/login", homeController.showLoginForm);
router.post("/login", homeController.handleLogin);
router.get("/seedAdminUser", userController.seedAdminUser);

module.exports = router;
