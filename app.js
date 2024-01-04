import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import taskRouter from "./routes/task.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./middlewares/error.js";

export const app = express();

// accessing config 
config({
    path: "./data/config.env"
})

// Using Middlewares for json, cookie parsing & cors
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Using routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
    res.send("Nice")
});

// Using error middleware
app.use(errorMiddleWare);