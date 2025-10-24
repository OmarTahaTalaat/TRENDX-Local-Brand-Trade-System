const asyncHandler = require("express-async-handler");

const { getUserDB, createUserDB, updateUserDB } = require("../database/userDB");
const { hash, compare } = require("../utils/bcryptService");
const { createHash } = require("../utils/cryptoService");
const { sendEmail } = require("../utils/emailService");
const { jwtGenerator } = require("../utils/jwtService");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

const createUser = async (data) => {
  const hashedpassword = await hash(data.password);

  const user = await createUserDB({ ...data, password: hashedpassword });

  const token = await jwtGenerator({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  return token;
};

const registerAsCustomer = asyncHandler(async (req, res, next) => {
  const customer = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    role: "customer",
  };

  await uniqueFieldsExistence({
    email: customer.email,
    phoneNumber: customer.phoneNumber,
  });

  const token = await createUser(customer);

  const response = { token, message: "Customer created successfully" };

  sendSuccessResponse(res, response, 201);
});

const registerAsSeller = asyncHandler(async (req, res, next) => {
  const seller = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    shopName: req.body.shopName,
    shopAddress: req.body.shopAddress,
    shopImage: req.body.shopImage,
    role: "seller",
  };

  await uniqueFieldsExistence({
    email: seller.email,
    phoneNumber: seller.phoneNumber,
    shopName: seller.shopName,
  });

  const token = await createUser(seller);

  const response = { token, message: "Seller created successfully" };

  sendSuccessResponse(res, response, 201);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await getUserDB({ email });

  if (!user || !(await compare(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 400));
  }

  if (user.active === false) {
    return next(
      new ApiError("You are blocked from accessing this account", 400)
    );
  }

  const token = await jwtGenerator({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  sendSuccessResponse(res, { token, role: user.role }, 200);
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await getUserDB({ email });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // generate reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = createHash(resetCode);
  user.passwordResetCode = hashedResetCode;

  // reset code expiration
  const tenMinutes = 10 * 60 * 1000;
  user.passwordResetExpires = Date.now() + tenMinutes;

  user.passwordResetVerified = false;

  await updateUserDB(
    { _id: user._id },
    {
      passwordResetCode: user.passwordResetCode,
      passwordResetExpires: user.passwordResetExpires,
      passwordResetVerified: user.passwordResetVerified,
    }
  );

  const message = `Hi ${user.name}, We received a request to reset the password on your TrendX Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The TrendX Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await updateUserDB(
      { _id: user._id },
      {
        passwordResetCode: user.passwordResetCode,
        passwordResetExpires: user.passwordResetExpires,
        passwordResetVerified: user.passwordResetVerified,
      }
    );

    return next(new ApiError("There is an error in sending email", 500));
  }

  const response = { message: "Reset code sent to your email" };

  sendSuccessResponse(res, response, 200);
});

const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { email, resetCode } = req.body;

  const hashedResetCode = createHash(resetCode);

  const user = await getUserDB({
    email,
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("invalid or expired code"));
  }

  user.passwordResetVerified = true;

  await updateUserDB(
    { _id: user._id },
    {
      passwordResetVerified: user.passwordResetVerified,
    }
  );

  const response = { message: "Verified" };

  sendSuccessResponse(res, response, 200);
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await getUserDB({ email });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = await hash(newPassword);
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await updateUserDB(
    { _id: user._id },
    {
      password: user.password,
      passwordResetCode: user.passwordResetCode,
      passwordResetExpires: user.passwordResetExpires,
      passwordResetVerified: user.passwordResetVerified,
    }
  );

  const token = await jwtGenerator({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  const response = { token };

  sendSuccessResponse(res, response, 200);
});

const uniqueFieldsExistence = async (fields) => {
  if (fields.email) {
    const emailExistence = await getUserDB({ email: fields.email });

    // check if email not exists in database
    if (emailExistence) {
      throw new ApiError("email already exists", 400);
    }
  }

  if (fields.phoneNumber) {
    const phoneNumberExistence = await getUserDB({
      phoneNumber: fields.phoneNumber,
    });

    // check if phoneNumber not exists in database
    if (phoneNumberExistence) {
      throw new ApiError("phoneNumber already exists", 400);
    }
  }

  if (fields.shopName) {
    const shopNameExistence = await getUserDB({ shopName: fields.shopName });
    // check if phoneNumber not exists in database
    if (shopNameExistence) {
      throw new ApiError("shopName already exists", 400);
    }
  }
};

module.exports = {
  registerAsCustomer,
  registerAsSeller,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
