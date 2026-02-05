import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri.split('@')[1]); // Log masked URI

try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Connected!');
    process.exit(0);
} catch (err) {
    console.log('FAILURE:', err.message);
    process.exit(1);
}
