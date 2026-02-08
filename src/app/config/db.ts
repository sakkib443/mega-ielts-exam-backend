import mongoose from "mongoose";

// MongoDB connection cache for serverless environments
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
    // If already connected, return immediately
    if (isConnected && mongoose.connection.readyState === 1) {
        return mongoose;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
        return connectionPromise;
    }

    // Create new connection
    connectionPromise = mongoose.connect(process.env.DATABASE_URL as string, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
    }).then((db) => {
        isConnected = true;
        console.log("MongoDB connected (cached)");
        return db;
    }).catch((err) => {
        connectionPromise = null;
        isConnected = false;
        throw err;
    });

    return connectionPromise;
};

// For Vercel serverless: ensure connection before each request
export const ensureDbConnection = async () => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
};
