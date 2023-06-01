// Create and export an express app
// Dependencies
import express from "express";
import cors from "cors";

import { appConfig } from "./config/index.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error_handler.js";

import("./auth/local_auth.js");
import("./auth/check_jwt.js");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", router);

// Catch all other routes and return the index file
app.get("*", (req, res) => {
  res.send("Not found");
});

// Set the port
app.set("port", appConfig.port);

//Error handling
app.use(errorHandler);

// Export the app
export default app;
