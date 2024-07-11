const mongoose = require('mongoose');

require('dotenv').config();

function databaseConnection()
{
    mongoose
      .connect(process.env.DB_URI)
      .then(() => console.log("Database Connected"))
      .catch((err) => console.log(err));
}

module.exports = databaseConnection;