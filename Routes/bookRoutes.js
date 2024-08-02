const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController");
const reviewRouter = require("./reviewRoutes");
const billRouter = require("./billRoutes");
const {
  protect,
  isLoggedIn,
  restrictTo,
} = require("../Controller/authController");

// review Route
router.use("/:bookId/reviews", reviewRouter);

// bill Route
router.use("/:bookId/bill", billRouter);

//Create book routes

//Get all books
router.get("/", protect, bookController.allBook);

// Filter books by category
router.get("/filter", bookController.filterBooksByCategory);

//Get one book,Update book, delete book
router.use(protect);
router.use(restrictTo("admin"));
router.post("/create", bookController.uploadImage, bookController.createBook);
router
  .route("/:id")
  .get(bookController.oneBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
