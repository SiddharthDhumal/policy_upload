const express = require("express");
const mongoose = require("mongoose");
const uploadRoutes = require("./routes/upload.route");
const policySearchRoutes = require("./routes/policySearch.route");
const policyAggregateRoutes = require("./routes/policyAggregate.route");
const scheduleRoutes = require("./routes/messageScheduler.route");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

require("dotenv").config();

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 mins
	max: 100,
	message: "Too many requests from this IP, please try again later",
});

const app = express();

mongoose
	.connect(process.env.MONGO_URI || "mongodb://localhost:27017/policydb")
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("Mongo Error:", err));

app.use(express.json());
app.use(helmet());
app.use("/api/", apiLimiter);
app.use("/api/upload", uploadRoutes);
app.use("/api/policies", policySearchRoutes);
app.use("/api/policies", policyAggregateRoutes);
app.use("/api", scheduleRoutes);

module.exports = app;
