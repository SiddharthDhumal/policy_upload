// models/ScheduledMessage.js
const mongoose = require('mongoose');

const scheduledMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  scheduledFor: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'processed'], default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);
