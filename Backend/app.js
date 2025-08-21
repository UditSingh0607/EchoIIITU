const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const postRouter = require("./routes/postsRouter");
const logger = require("./utils/logger"); // Uncomment if you want to use logger

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/api/v0/posts",postRouter);

module.exports = app;
