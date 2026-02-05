import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema({
    battery: Number,
    speed: Number,
    coordinates: {
        lat: Number,
        lng: Number
    },
    orientation: {
        pitch: Number,
        roll: Number,
        yaw: Number
    },
    status: String,
    mode: String,
    timestamp: { type: Date, default: Date.now }
});

export const Telemetry = mongoose.model('Telemetry', TelemetrySchema);
