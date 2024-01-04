import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        await Task.create({
            title,
            description,
            user: req.user
        });
        res.status(201).json({
            success: true,
            message: "Task added successfully"
        })

    } catch (error) {
        // console.error("Error creating new task:", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};

export const getMyTask = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const tasks = await Task.find({ user: userId });

        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        // console.error("Error :", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) return next(new ErrorHandler("Task not found", 404));

        task.isCompleted = !task.isCompleted;
        await task.save();
        res.status(200).json({
            success: true,
            message: "Task Updated"
        });
    } catch (error) {
        // console.error("Error :", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) return next(new ErrorHandler("Task not found", 404));

        await task.deleteOne();
        res.status(200).json({
            success: true,
            message: "Task Deleted"
        });
    } catch (error) {
        // console.error("Error :", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};