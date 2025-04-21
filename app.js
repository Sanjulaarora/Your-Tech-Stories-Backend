import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRouter.js";
import blogRouter from "./routes/blogRouter.js";

dotenv.config();

const app = express();

const corsOptions = {
	origin: "http://localhost:3000",
	methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD"],
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(express.json());
app.use(cookieParser(""));
app.use(cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);

app.get("/", (req, res) => {
	res.send("Blog App Server is up and running!");
});

const PORT = process.env.PORT || 8005;

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port: ${PORT}`);
	});

	app.on("error", (error) => {
		console.error(`Error: ${error}`);
		throw error;
	});
}).catch((err) => {
	console.error(`MongoDB connection failed: ${err}`);
});
