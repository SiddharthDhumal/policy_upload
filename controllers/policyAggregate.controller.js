const Policy = require("../models/Policy");
const User = require("../models/User");

const aggregatePoliciesByUser = async (req, res) => {
	try {
		const result = await Policy.aggregate([
			{
				$group: {
					_id: "$userId",
					totalPolicies: { $sum: 1 },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$unwind: "$user",
			},
			{
				$project: {
					_id: 0,
					userId: "$user._id",
					name: "$user.firstName",
					email: "$user.email",
					totalPolicies: 1,
				},
			},
		]);

		res.status(200).json(result);
	} catch (err) {
		console.error("Aggregation error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

module.exports = { aggregatePoliciesByUser };
