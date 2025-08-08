// scheduler/agenda.js
const Agenda = require("agenda");
const ScheduledMessage = require("../models/ScheduledMessage");

const mongoConnectionString =
	process.env.MONGO_URI || "mongodb://localhost:27017/policydb";

const agenda = new Agenda({
	db: {
		address: mongoConnectionString,
		collection: "agendaJobs",
	},
	processEvery: "1 minute",
	maxConcurrency: 3,
	defaultConcurrency: 1,
});

// Define the job
agenda.define("process scheduled message", async (job, done) => {
	const { messageId } = job.attrs.data;

	if (!messageId) {
		console.error("[ScheduledJob] Missing messageId in job data.");
		return done(new Error("Invalid job payload"));
	}

	try {
		const doc = await ScheduledMessage.findById(messageId);

		if (!doc) {
			console.warn(`[ScheduledJob] No document found for ID: ${messageId}`);
			return done();
		}

		if (doc.status === "processed") {
			console.log(`[ScheduledJob] Message already processed: ${messageId}`);
			return done();
		}

		console.log(
			`[ScheduledJob] Processing message: "${
				doc.message
			}" at ${new Date().toISOString()}`
		);

		doc.status = "processed";
		await doc.save();

		done();
	} catch (err) {
		console.error(
			`[ScheduledJob]  Failed to process messageId ${messageId}:`,
			err
		);
		done(err);
	}
});

const startAgenda = async () => {
	await agenda.start();
};

module.exports = { agenda, startAgenda };
