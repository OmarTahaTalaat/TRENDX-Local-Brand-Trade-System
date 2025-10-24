const jwt = require("jsonwebtoken");

const jwtGenerator = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

const jwtVerify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports = { jwtGenerator, jwtVerify };
