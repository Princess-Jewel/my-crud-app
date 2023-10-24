const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use("/auth", require("./routes/authRoutes"));
app.use("/posts", require("./routes/postsRoutes"));
app.use("/comments", require("./routes/commentsRoutes"));
app.use(errorHandler);
app.use(cookieParser());

const port = process.env.PORT || 5000;

const sequelize = require("./config/databaseConnection");

const Users = require("./models/users");

const Posts = require("./models/posts");

const Comments = require("./models/comments");

Posts.hasMany(Comments);

sequelize
  .sync()
  .then(result => {
    // console.log(result);
  })
  .catch(err => {
    // console.log(err);
  });
  app.listen(3002, () => {
    console.log(`yay! server is running on ${port}`);
  });