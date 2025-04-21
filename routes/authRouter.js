import express from "express";
import authenticate from "../middleware/authenticate.js";
import { signUp, signIn, signOut} from "../controllers/authController.js";

const authRouter = express.Router();

// Routes for user authentication
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.get("/sign-out", authenticate, signOut);

export default authRouter;