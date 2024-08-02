const express = require("express");
const viewsController = require("../Controller/viewsController");
const authController = require("../Controller/authController");

const router = express.Router();

const listCategories = [
  "Action",
  "Fantasy",
  "Adventure",
  "History",
  "Animation",
  "Horror",
  "Thriller",
  "Mystery",
  "Comedy",
  "Romance",
  "Science Fiction",
  "Sci-fi",
];
const globalsVar = {
  listCategories,
};

router.use((req, res, next) => {
  res.locals = {
    ...res.locals,
    ...globalsVar,
  };
  next();
});
//Book detail
router.get(
  "/details/:bookId",
  authController.isLoggedIn,
  viewsController.getBookDetail
);

//Cart Items
router.get("/cart", authController.isLoggedIn, viewsController.getCart);

//Contract & services
router.get("/contracts", viewsController.getContracts);

//login page
router.get("/login", authController.isLoggedIn, viewsController.getLogin);

router.get("/signup", authController.isLoggedIn, viewsController.getSignup);

router.get("/signup", authController.isLoggedIn, viewsController.getSignup);

//overview page
router.get("/", authController.isLoggedIn, viewsController.getOverview);

// filtered books

router
  .route("/filter")
  .get(authController.isLoggedIn, viewsController.filteredBooks);

// profile
router
  .route("/profile")
  .get(authController.isLoggedIn, viewsController.getProfile);

// get shipping bills
router
  .route("/shippingBills")
  .get(
    authController.protect,
    authController.restrictTo("shipper"),
    viewsController.getShipBills
  );

  router
  .route("/success/:billId")
  .get(
    authController.protect,
    viewsController.getSuccess
  );

module.exports = router;
