const {
  sendFailResponse,
  sendErrorResponse,
} = require("../utils/responseHandler");

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(err.stack);

  if (err.status === "fail") {
    sendFailResponse(res, err.message, err.statusCode);
  } else {
    sendErrorResponse(res, err.message, err.statusCode);
  }
};

module.exports = errorMiddleware;
