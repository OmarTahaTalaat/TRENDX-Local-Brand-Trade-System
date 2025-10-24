// Core modules
const path = require("path");

// Third-Party modules
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const cors = require("cors");

// Import
const dbConnection = require("./database/dbConfig");
const mountRoutes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Database connection
dbConnection();

// Express app
const app = express();

// Enable other domains to acccess your application
app.use(cors({ origin: true }));
app.options("*", cors());

// Middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
mountRoutes(app);

// Global error handler middleware for express
app.use(errorMiddleware);

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Handle rejected requests outside express server
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection Errors: ${err}`);
  server.close(() => {
    console.log("Server closed");
    process.exit(1);
  });
});
