const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get("/api/weather", weatherController.weatherAPI);

module.exports = router;
