const express = require("express");
const router = express.Router();
const mapController = require("../Controllers/mapController.js");

router.get("/getroute", mapController.getRoute);

module.exports = router;