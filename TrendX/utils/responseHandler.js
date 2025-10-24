const sendSuccessResponse = (res, resData, statusCode = 200) => {
  res.status(statusCode).json({ status: "success", data: resData });
};

const sendFailResponse = (res, resMessage, statusCode = 400) => {
  res.status(statusCode).json({ status: "fail", message: resMessage });
};

const sendErrorResponse = (res, resMessage, statusCode = 500) => {
  res.status(statusCode).json({ status: "error", message: resMessage });
};

module.exports = { sendSuccessResponse, sendFailResponse, sendErrorResponse };
