// const multer = require("multer");
// const sharp = require("sharp");
const Customer = require("../Model/customerModel"); // Adjust this path as needed for your Sequelize model
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! please upload only images.", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadUserPhoto = upload.single("photo");

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`basicrouting/public/img/userphoto/${req.file.filename}`);

//   next();
// });

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.findAll();

  res.status(200).json({
    status: "success",
    result: customers.length,
    timeAtRequest: req.requestTime,
    data: customers,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword"
      ),
      400
    );
  }

  const filteredBody = filteredObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedCustomer = await Customer.update(filteredBody, {
    where: { id: req.user.id },
    returning: true,
    individualHooks: true, // This ensures that hooks like password hashing are still run
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedCustomer[1][0], // Sequelize returns an array, [affectedCount, affectedRows]
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Customer.update({ active: false }, { where: { id: req.user.id } });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.deleteCustomer = factory.deleteOne(Customer);
exports.updatedCustomer = factory.updateOne(Customer);
exports.getCustomer = factory.getOne(Customer);
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.createCustomer = factory.createOne(Customer);

// Shipper
exports.setShipperId = catchAsync(async (req, res, next) => {
  // randomly choose shipper for the bill
  const shippers = await Customer.findAll({
    where: {
      role: "shipper",
      numbOfOrder: { [Op.lt]: 100 },
    },
  });

  if (!shippers.length) {
    return next(new AppError("No available shippers found.", 403));
  }

  const shipper = shippers[0];
  await shipper.increment('numbOfOrder'); // Update number of orders
  req.body.shipper = shipper.id;
  console.log(shipper);
  next();
});

// for admin
exports.setRoles = catchAsync(async (req, res, next) => {
  const customerPhoneNumber = parseInt(req.body.phoneNumber, 10);
  console.log(typeof customerPhoneNumber);

  const customer = await Customer.update(
    { role: req.body.role },
    { where: { phoneNumber: customerPhoneNumber }, returning: true }
  );

  if (!customer[0]) {
    return next(new AppError("Cannot find customer", 403));
  }

  res.status(200).json({
    status: "success",
    data: customer[1][0], // Sequelize returns an array, [affectedCount, affectedRows]
  });
});
