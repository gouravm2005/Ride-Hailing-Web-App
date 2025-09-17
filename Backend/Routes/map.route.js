const express = require("express");
const router = express.Router();
const mapController = require("../Controllers/mapController");

router.get("/getroute", mapController.getRoute);

module.exports = router;