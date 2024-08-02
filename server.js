const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` }); // Load environment variables first

const { app } = require("./app");
const sequelize = require("./sequelize"); // Import your Sequelize connection

const port = process.env.PORT || 3000;

// Test the database connection and start the server
sequelize.authenticate()
  .then(() => {
    console.log("Connected to the PostgreSQL database");

    const server = app.listen(port, () => {
      console.log(`App running on port : ${port}`);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.log("UNCAUGHT EXCEPTION!!, shutting down...");
      console.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM signal
    process.on("SIGTERM", () => {
      console.log("SIGTERM RECEIVED. Shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
      });
    });

  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Log the environment
console.log(app.get("env"));
