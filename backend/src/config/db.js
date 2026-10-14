import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Explicitly set strictQuery to suppress the deprecation warning
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); 
  }
};