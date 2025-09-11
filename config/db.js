import mongoose from "mongoose";


export default async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/syncskilledDB")
        console.log("Connected to db: ", conn.connections[0].name)
        
    } catch (error) {
        console.error("Database connection failed", error)
    }
}

