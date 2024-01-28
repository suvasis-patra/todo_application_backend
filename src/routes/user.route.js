import express from "express";
import {
  checkUserAuthState,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);

// protected route
router.route("/logout").post(userAuth, logoutUser);
router.route("/check").get(userAuth, checkUserAuthState);

export default router;
