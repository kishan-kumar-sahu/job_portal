import mongoose from "mongoose";

const connectDb = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/job_portal";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    return mongoose.connection;
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDb;
