const app = require("./app");
const { monitorCPU } = require("./utils/cpuMonitor");
const { startAgenda } = require("./scheduler/agenda");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
	console.log(`Server running on port ${PORT}`);
	monitorCPU();
	await startAgenda(); //  Start job processor
});
