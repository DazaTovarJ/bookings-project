// Create and export an express app
// Dependencies
import express from "express";
import {appConfig} from "./config/index.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error_handler.js";
// const routes = require('./routes');

import("./auth/local_auth.js");

const app = express();

// Middleware
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
