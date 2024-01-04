import mongoose from "mongoose";

export const connectDB = () => {
    return mongoose
        .connect(process.env.MONGO_URI,
            {
                dbName: 'backendapi'
            }
        ).then(() => console.log("Database connected !!!")
        ).catch((err) => console.log("Error :", err));
};