const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.MONGO_URL).then((conn) => {
    console.log(`Mongo server started on ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
