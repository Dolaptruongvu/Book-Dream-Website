const express = require("express");
var morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const bookRoutes = require("./Routes/bookRoutes");
const customerRoutes = require("./Routes/customerRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const billRoutes = require("./Routes/billRoutes");
const globalErrorHandler = require("./Controller/errorController");
const viewRouter = require("./Routes/viewsRoutes");
const cors = require("cors");
// app area
const app = express();
app.enable("trust proxy");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Body parser, reading data from body into rq.body

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// morgan use to read the log from middleware
app.use(morgan("common"));

app.use(
  cors({
    origin: ["http://127.0.0.1:5500"],
  })
);

//serving static file
app.use(express.static(path.join(__dirname, "public")));
// Test middleware

app.use((req, res, next) => {
  req.requestTimee = new Date().toISOString();

  next();
});

// Book routes

app.use("/api/v1/books", bookRoutes);

// Bill routes
app.use("/api/v1/bill", billRoutes);

// User routes
app.use("/api/v1/customer", customerRoutes);

// Review routes
app.use("/api/v1/reviews", reviewRoutes);

// View router
app.use("/", viewRouter);

// Global Error Handling MiddleWare

app.use(globalErrorHandler);

module.exports = { app };
