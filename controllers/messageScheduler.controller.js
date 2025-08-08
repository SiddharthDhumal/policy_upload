const ScheduledMessage = require("../models/ScheduledMessage");
const { agenda } = require("../scheduler/agenda");

const scheduleMessage = async (req, res) => {
	try {
		const { message, day, time } = req.body;

		if (!message || !day || !time) {
			return res
				.status(400)
				.json({ error: "message, day, and time are required" });
		}

		const scheduledFor = new Date(`${day}T${time}:00`);

		if (isNaN(scheduledFor)) {
			return res.status(400).json({ error: "Invalid date/time format" });
		}

		if (scheduledFor < new Date()) {
			return res
				.status(400)
				.json({ error: "Scheduled time must be in the future" });
		}

		const scheduledMessage = await ScheduledMessage.create({
			message,
			scheduledFor,
		});

		await agenda.schedule(scheduledFor, "process scheduled message", {
			messageId: scheduledMessage._id,
		});

		res.status(200).json({
			message: "Message scheduled successfully",
			scheduledFor,
			id: scheduledMessage._id,
		});
	} catch (err) {
		console.error("Schedule error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

module.exports = { scheduleMessage };
