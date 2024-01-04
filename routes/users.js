import express from "express";
import { createNewUser, getAllUsers, getMyProfile, getUserByEmail, loginUser, logoutUser } from "../controllers/users.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", getAllUsers);

router.post("/new", createNewUser);

router.post("/login", loginUser);

router.get("/logout", isAuthenticated, logoutUser);

router.get("/me", isAuthenticated, getMyProfile);

router.get('/email/:email', getUserByEmail);

export default router;