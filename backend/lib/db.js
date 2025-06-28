import mongoose from "mongoose";

//To connect to the database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected',()=>{console.log("Successfully connected to the database")});
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (err) {
        console.log(err);
    }
}