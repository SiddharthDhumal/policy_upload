const express = require("express");
const router = express.Router();

const {
	aggregatePoliciesByUser,
} = require("../controllers/policyAggregate.controller");

router.get("/aggregate", aggregatePoliciesByUser);

module.exports = router;
