const crypto = require("crypto");

const createHash = (value) => {
  const hashedValue = crypto.createHash("sha256").update(value).digest("hex");
  return hashedValue;
};

module.exports = { createHash };
