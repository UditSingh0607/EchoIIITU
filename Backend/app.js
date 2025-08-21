const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const postRouter = require("./routes/postsRouter");
const logger = require("./utils/logger"); // Uncomment if you want to use logger
const commentRoutes = require("./routes/commentRoutes");
const assignDeviceId = require("./middlewares/assignId"); 
const app = express();
const cookieParser = require("cookie-parser");
// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(assignDeviceId);

// Routes
app.use("/api/v0/comments", commentRoutes);
app.use("/api/v0/posts",postRouter);

module.exports = app;
