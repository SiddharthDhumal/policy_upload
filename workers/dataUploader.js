const { parentPort, workerData } = require("worker_threads");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const Agent = require("../models/Agent");
const User = require("../models/User");
const Account = require("../models/Account");
const Carrier = require("../models/Carrier");
const Policy = require("../models/Policy");
const PolicyCategory = require("../models/PolicyCategory");

mongoose.connect(
	process.env.MONGO_URI || "mongodb://localhost:27017/policydb",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
const policyInserts = [];

const parseCSV = async (filePath) => {
	return new Promise((resolve, reject) => {
		const results = [];
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (data) => results.push(data))
			.on("end", () => resolve(results))
			.on("error", reject);
	});
};

const insertData = async (rows) => {
	const stats = {
		agents: 0,
		users: 0,
		accounts: 0,
		carriers: 0,
		lobs: 0,
		policies: 0,
	};

	for (const row of rows) {
		const agent = await Agent.findOneAndUpdate(
			{ name: row.agent },
			{ name: row.agent },
			{ upsert: true, new: true }
		);
		stats.agents++;

		const user = await User.findOneAndUpdate(
			{ email: row.email },
			{
				firstName: row.firstname,
				dob: new Date(row.dob),
				address: row.address,
				phoneNumber: row.phone,
				state: row.state,
				zipCode: row.zip,
				email: row.email,
				gender: row.gender,
				userType: row.userType,
			},
			{ upsert: true, new: true }
		);
		stats.users++;

		const account = await Account.findOneAndUpdate(
			{ name: row.account_name, userId: user._id },
			{ name: row.account_name, userId: user._id },
			{ upsert: true, new: true }
		);
		stats.accounts++;

		const carrier = await Carrier.findOneAndUpdate(
			{ companyName: row.company_name },
			{ companyName: row.company_name },
			{ upsert: true, new: true }
		);
		stats.carriers++;

		const category = await PolicyCategory.findOneAndUpdate(
			{ categoryName: row.category_name },
			{ categoryName: row.category_name },
			{ upsert: true, new: true }
		);
		stats.lobs++;

		policyInserts.push({
			policyNumber: row.policy_number,
			policyStartDate: new Date(row.policy_start_date),
			policyEndDate: new Date(row.policy_end_date),
			userId: user._id,
			companyId: carrier._id,
			categoryId: category._id,
			accountId: account._id,
			agentId: agent._id,
		});
		stats.policies++;
	}

	if (policyInserts.length) {
		await Policy.insertMany(policyInserts);
		stats.policies = policyInserts.length;
	}

	return stats;
};

(async () => {
	try {
		const rows = await parseCSV(workerData.filePath);
		const result = await insertData(rows);
		parentPort.postMessage(result);
	} catch (err) {
		parentPort.postMessage({ error: err.message });
		process.exit(1);
	} finally {
		mongoose.connection.close();
	}
})();
