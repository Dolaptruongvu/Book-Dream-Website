const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Customer = require("../Model/customerModel");
const Book = require("../Model/bookModel");
const { catchAsync } = require("../utils/catchAsync");
const app = require("../app");
const AppError = require("../utils/appError");
// const Email = require("../utils/email");
const crypto = require("crypto");
// const Tour = require("../models/tourModels");
const { decode } = require("punycode");
const { json } = require("express");
const { Vonage } = require("@vonage/server-sdk");

const signToken = (id, secret, expire) => {
  return jwt.sign({ id }, secret, {
    expiresIn: expire,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await Customer.create(req.body);
  //   const token = signToken(
  //     newUser._id,
  //     process.env.JWT_EMAILSECRET,
  //     process.env.JWT_EMAILSECRET_EXPIRES_IN
  //   );

  //   const confirmEmailUrl = `${req.protocol}://${req.get(
  //     "host"
  //   )}/api/v1/users/confirmEmail/${token}`;

  //   await new Email(newUser, confirmEmailUrl).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await Customer.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //   if (user.smsOTPStatus) {
  //     return res.status(303).json({
  //       status: "success",
  //       data: {
  //         smsOTPStatus: user.smsOTPStatus,
  //         url: `http://127.0.0.1:3000/api/v1/users/2FA/${user.id}`,
  //       },
  //     });
  //   }

  createSendToken(user, 200, req, res);
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    res.locals.customer = null;
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await Customer.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.customer = currentUser;

      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};
exports.logout = (req, res) => {
  res.cookie("jwt", "logouttoken", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in ! please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await Customer.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The token belonging to this token does no longer exist.")
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again"),
      401
    );
  }

  req.customer = currentUser;
  res.locals.customer = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.customer.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.preventSetRight = catchAsync(async (req, res, next) => {
  // prevent user set admin while signup process
  if (req.body.role == "user" || req.body.role == "" || req.body.role == null) {
    next();
  } else {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
});

// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     next(new AppError("There is no user with email address", 404));
//   }

//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   try {
//     const resetURL = `${req.protocol}://${req.get(
//       "host"
//     )}/api/v1/users/resetPassword/${resetToken}`;

//     await new Email(user, resetURL).sendPasswordReset();
//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email !",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(
//       new AppError("There was an error sending email. Try again later !"),
//       500
//     );
//   }
// });

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new AppError("Token is invalid or has expired"), 400);
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   createSendToken(user, 200, req, res);
// });

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");
//   if (!user) return next(new AppError("wrong id"), 404);

//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError("uncorrect password"), 404);
//   }

//   user.password = req.body.newPassword;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();

//   createSendToken(user, 200, req, res);
// });
