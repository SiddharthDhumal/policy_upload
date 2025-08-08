const { Worker } = require("worker_threads");
const path = require("path");
const fs = require("fs");

const handleFileUpload = (req, res) => {
	const filePath = req.file.path;

	const worker = new Worker(
		path.join(__dirname, "../workers/dataUploader.js"),
		{
			workerData: { filePath },
		}
	);

	worker.on("message", (message) => {
		res.status(200).json({ message: "Upload complete", details: message });
		fs.unlink(filePath, () => {});
	});

	worker.on("error", (error) => {
		console.error("Worker error:", error);
		res
			.status(500)
			.json({ message: "Worker thread failed", error: error.message });
		fs.unlink(filePath, () => {});
	});

	worker.on("exit", (code) => {
		if (code !== 0) console.warn(`Worker stopped with exit code ${code}`);
	});
};

module.exports = { handleFileUpload };
