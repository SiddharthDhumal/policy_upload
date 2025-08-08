const pidusage = require("pidusage");
const os = require("os");
const { exec } = require("child_process");

let restartInProgress = false;
const CPU_THRESHOLD = 70; // in percent
const CHECK_INTERVAL = 10000; // 10s

function monitorCPU() {
	setInterval(async () => {
		try {
			const stats = await pidusage(process.pid);

			const cpu = stats.cpu.toFixed(2);
			const memoryMB = (stats.memory / 1024 / 1024).toFixed(2);

			console.log(`[CPU Monitor] CPU: ${cpu}% | Memory: ${memoryMB} MB`);

			if (cpu > CPU_THRESHOLD && !restartInProgress) {
				restartInProgress = true;
				console.warn(
					`[CPU Monitor] CPU usage ${cpu}% > ${CPU_THRESHOLD}%. Restarting server...`
				);
				gracefulRestart();
			}
		} catch (err) {
			console.error("[CPU Monitor] Error tracking CPU:", err);
		}
	}, CHECK_INTERVAL);
}

function gracefulRestart() {
	if (process.env.NODE_ENV === "production") {
		exec("pm2 restart all", (error, stdout, stderr) => {
			if (error) {
				console.error(`[CPU Monitor] PM2 Restart Error: ${error.message}`);
				return;
			}
			console.log(`[CPU Monitor] PM2 Restart Success: ${stdout}`);
		});
	} else {
		console.log("[CPU Monitor] Exiting process in dev mode...");
		process.exit(1);
	}
}

module.exports = { monitorCPU };
