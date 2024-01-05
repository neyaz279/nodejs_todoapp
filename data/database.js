import mongoose from "mongoose";

export const connectDB = () => {
    return mongoose
        .connect(process.env.MONGO_URI,
            {
                dbName: 'backendapi'
            }
        ).then((c) => console.log(`Database connected with ${c.connection.host}`)
        ).catch((err) => console.log("Error :", err));
};