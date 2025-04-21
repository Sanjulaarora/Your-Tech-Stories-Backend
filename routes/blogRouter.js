import express from "express";
import authenticate from "../middleware/authenticate.js";
import { createBlog, getBlogs, updateBlog, deleteBlog } from "../controllers/blogController.js";

const blogRouter = express.Router();

// Routes for Blog CRUD operations
blogRouter.post("/create-blog", createBlog);
blogRouter.get("/get-blogs", getBlogs);
blogRouter.put("/update-blog/:id", authenticate, updateBlog);
blogRouter.delete("/delete-blog/:id", authenticate, deleteBlog);

export default blogRouter;