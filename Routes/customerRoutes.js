const express = require("express");
const fs = require("fs");
const authController = require("../Controller/authController");
const customerController = require("../Controller/customerController");
// const viewsController = require("../Controllers/viewsController");
// const bookingRouter = require("./bookingRoutes");

const router = express.Router();

// For Authentication

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/signup", authController.preventSetRight, authController.signup);

router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

router
  .route("/:id")
  .get(customerController.getCustomer)
  .delete(customerController.deleteCustomer)
  .patch(customerController.updatedCustomer);

// route for admin

router
  .route("/setRoles")
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    customerController.setRoles
  );


module.exports = router;
