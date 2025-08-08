// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		dob: { type: Date, required: true },
		address: { type: String },
		phoneNumber: { type: String },
		state: { type: String },
		zipCode: { type: String },
		email: { type: String, unique: true },
		gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
		userType: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
