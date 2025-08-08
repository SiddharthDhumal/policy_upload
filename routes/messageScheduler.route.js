const express = require("express");
const router = express.Router();
const {
	scheduleMessage,
} = require("../controllers/messageScheduler.controller.js");

router.post("/schedule", scheduleMessage);

module.exports = router;
