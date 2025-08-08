const express = require("express");
const router = express.Router();
const {
	searchPoliciesByUser,
} = require("../controllers/policySearch.controller");

router.get("/search", searchPoliciesByUser);

module.exports = router;
