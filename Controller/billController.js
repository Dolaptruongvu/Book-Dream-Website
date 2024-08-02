const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Bill = require("../Model/billModel");
const Customer = require("../Model/customerModel");
const stripe = require("stripe")(
  "sk_test_51PABiLDfNmKHuQemhXjI6l5u2yws9mThmNOfdbvJKUqSb7ILv7bLUGqdWm3ZxcKiRewofG945fWtiG5U5LxOfx3X00dcCBnNvV"
);

exports.createBill = catchAsync(async (req, res, next) => {
  const user = res.locals.customer;
  const newBill = await Bill.create({ ...req.body, customerId: user.id });

  res.status(201).json({
    status: "success",
    data: newBill,
  });
});

// Get all bills
exports.getBills = handlerFactory.getAll(Bill);

// Set payment status for a bill
exports.setPaymentStatus = catchAsync(async (req, res, next) => {
  const billId = req.params.id;
  const [updatedCount, updatedBills] = await Bill.update(
    { haspaid: req.body.haspaid },
    { where: { id: billId }, returning: true }
  );

  if (updatedCount === 0) {
    return next(new AppError("Cannot find bill", 403));
  }

  res.status(200).json({
    status: "success",
    data: updatedBills[0], // The updated bill
  });
});

// Get shipping bills for a shipper
exports.getShippingBill = catchAsync(async (req, res, next) => {
  const bills = await Bill.findAll({ where: { shipperId: req.customer.id } });

  res.status(200).json({
    status: "success",
    data: bills,
  });
});

// Create a Stripe checkout session
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const billId = req.params.id;

  const bill = await Bill.findByPk(billId, { include: Customer });
  if (!bill) {
    return next(new AppError("Cannot find bill", 403));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Bill Payment of ${bill.customer.name}`,
            description: `Bill ID: ${billId}`,
          },
          unit_amount: parseInt(bill.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:3000/success/${bill.id}`,
    cancel_url: `http://localhost:3000/fail/${bill.id}`,
  });

  try {
    const [updatedCount] = await Bill.update(
      { haspaid: true },
      { where: { id: billId } }
    );

    if (updatedCount === 0) {
      console.error(`Error updating bill ${billId} payment status`);
    }
  } catch (error) {
    console.error(`Error updating bill ${billId} payment status:`, error);
  }

  res.json({ url: session.url });
});

// Update payment status
exports.updatePay = catchAsync(async (req, res, next) => {
  const id = req.params.billId;
  const [updatedCount] = await Bill.update(
    { haspaid: true },
    { where: { id } }
  );

  if (updatedCount === 0) {
    return next(new AppError("Cannot find bill", 403));
  }

  res.status(200).json({
    status: "success",
  });
});
