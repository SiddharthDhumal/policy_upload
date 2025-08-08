// models/Policy.js
const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
	{
		policyNumber: { type: String, required: true },
		policyStartDate: { type: Date },
		policyEndDate: { type: Date },

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "PolicyCategory",
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Carrier",
			required: true,
		},
		accountId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
			required: true,
		},
		agentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Agent",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Policy", policySchema);
