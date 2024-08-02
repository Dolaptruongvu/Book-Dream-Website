const express = require("express");
const billController = require("../Controller/billController");
const bookController = require("../Controller/bookController");
const customerController = require("../Controller/customerController");
const authController = require("../Controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    customerController.setShipperId,
    billController.createBill
  ) // create bill
  .get(billController.getBills);

router
  .route("/myShippingBills")
  .get(
    authController.protect,
    authController.restrictTo("shipper", "admin"),
    billController.getShippingBill
  );

router
  .route("/setPaymentStatus/:id")
  .patch(
    authController.protect,
    authController.restrictTo("shipper", "admin"),
    billController.setPaymentStatus
  );

router.get(
  "/checkout-session/:id",
  authController.protect,
  authController.restrictTo("user"),
  billController.createCheckoutSession
);

router.post(
  "/update-pay/:billId",
  authController.protect,
  authController.restrictTo("shipper"),
  billController.updatePay
);
module.exports = router;
