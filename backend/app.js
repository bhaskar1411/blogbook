const express = require("express");
const bodyParser = require('body-parser');
const mongoClient = require('mongoose');

const blogRouter = require("./routes/blog");
const userRouter = require("./routes/user");

//aqoW2E4lepeku60i

const app = express();

mongoClient.connect("mongodb+srv://bhaskar7:"+ process.env.MONGO_ATLAS_PW +"@cluster0-om7di.mongodb.net/blogchat")
.then(() => {
  console.log("Database connected!!");
})
.catch(() => {
  console.log("Connection failed!!");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/blog", blogRouter);

app.use("/api/user", userRouter);

module.exports = app;
