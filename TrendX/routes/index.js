const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");

const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const orderRoute = require("./orderRoute");
const reviewRoute = require("./reviewRoute");
const productRoute = require("./productRoute");
const wishlistRoute = require("./wishlistRoute");
const categoryRoute = require("./categoryRoute");
const cartRoute = require("./cartRoute");
const shopRoute = require("./shopRoute");
const chatbotRoute = require("./chatbotRoute");


const mountRoutes = (app) => {
  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.use("/orders", orderRoute);
  app.use("/reviews", reviewRoute);
  app.use("/products", productRoute);
  app.use("/wishlist", wishlistRoute);
  app.use("/category", categoryRoute);
  app.use("/carts", cartRoute);
  app.use("/shops", shopRoute);
  app.use('/api/info', chatbotRoute);

  app.get("/", (req, res) => {
    sendSuccessResponse(res, { message: "Hello form server side!" }, 200);
  });

  app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
};

module.exports = mountRoutes;
