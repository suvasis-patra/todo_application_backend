import express from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import {
  deleteTodo,
  getAllTodos,
  getUserTodo,
  postTodo,
} from "../controllers/Todo.controller.js";

const router = express.Router();

router.route("/getAllTodos").get(getAllTodos);

// Protected routes

router.route("/getTodo").get(userAuth, getUserTodo);
router.route("/createTodo").post(userAuth, postTodo);
router.route("/updateTodo").patch(userAuth);
router.route("/deleteTodo").delete(userAuth, deleteTodo);

export default router;
