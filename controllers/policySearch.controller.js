const User = require("../models/User");
const Policy = require("../models/Policy");
const Agent = require("../models/Agent");
const Account = require("../models/Account");
const Carrier = require("../models/Carrier");
const PolicyCategory = require("../models/PolicyCategory");

const searchPoliciesByUser = async (req, res) => {
	try {
		const { email, name } = req.query;

		if (!email && !name) {
			return res.status(400).json({ error: "Please provide email or name" });
		}

		// Find user
		const user = await User.findOne(email ? { email } : { firstName: name });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Find policies by userId and populate references
		const policies = await Policy.find({ userId: user._id })
			.populate("agentId", "name")
			.populate("accountId", "name")
			.populate("companyId", "companyName")
			.populate("categoryId", "categoryName")
			.populate("userId", "firstName email dob phoneNumber gender address");

		res.status(200).json({
			user: {
				name: user.firstName,
				email: user.email,
			},
			totalPolicies: policies.length,
			policies,
		});
	} catch (err) {
		console.error("Search error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

module.exports = { searchPoliciesByUser };
