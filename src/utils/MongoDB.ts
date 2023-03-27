import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config()

const mongoDB_URI: string = process.env.MONGODB_URI || '';

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoDB_URI);
        console.log('MongoDB connected');
    } catch (error: any) {
        console.error("Error While Connecting to MongoDB");
        console.error(error.message);
    }
}

export default connectDB;
