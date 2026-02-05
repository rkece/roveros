import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with specific client URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('✅ MongoDB Connected to Surveillance Rover DB'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        // Continue running server even if DB fails for demo purposes, 
        // but in production we might want to exit.
    });



// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send({ status: 'Online', system: 'Rover Command Center API', version: '1.0.0' });
});

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join specific rooms if needed
    socket.join('telemetry');

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });

    // Mock Rover Telemetry Data Emitter
    // In a real app, this would come from the Rover via an API endpoint or MQTT bridge
    const telemetryInterval = setInterval(() => {
        const data = {
            battery: Math.max(0, 100 - (Date.now() % 100000) / 1000), // Simulated drain
            speed: Math.abs(Math.sin(Date.now() / 10000)) * 5,
            coordinates: {
                lat: 34.0522 + Math.sin(Date.now() / 5000) * 0.001,
                lng: -118.2437 + Math.cos(Date.now() / 5000) * 0.001
            },
            orientation: {
                pitch: Math.sin(Date.now() / 2000) * 5,
                roll: Math.cos(Date.now() / 3000) * 2,
                yaw: (Date.now() / 100) % 360
            },
            status: 'ONLINE',
            mode: Math.random() > 0.9 ? 'AUTONOMOUS' : 'MANUAL',
            obstacles: Math.random() > 0.95 ? [{ distance: 1.2, angle: 45 }] : []
        };

        socket.emit('rover:telemetry', data);
    }, 1000);

    socket.on('disconnect', () => {
        clearInterval(telemetryInterval);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
