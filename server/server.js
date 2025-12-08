require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const  {config} = require('./src/config/env');
const {notFoundHandler, errorHandler} = require('./src/middleware/error.middleware');
require('./src/models/user.model');

const authRoutes = require('./src/routes/auth.routes');
const protectedRoutes = require('./src/routes/protected.routes');

const app = express();

// ----- Basic middleware ---------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --------------- Health check route ---------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Taskflow mean backend is running" });
});

// ------------- Routes --------
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// ----------- 404 + Error handling --------

app.use(notFoundHandler);
app.use(errorHandler);

// ------------ MongoDB connection -----------

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'MONGO_URI_NOT_SET';

async function startServer(){
    try {
        if(MONGO_URI === 'MONGO_URI_NOT_SET'){
            console.warn('⚠️ MONGO_URI is not set. Skipping DB connection (placholder mode). ')
        } else {
            await mongoose.connect(MONGO_URI);
            console.log('✅ Connected to MongoDB');
        }
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err){
        console.error('❌ Error starting server:', err.message);
        process.exit(1);
    }
}

startServer();