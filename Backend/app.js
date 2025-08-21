const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use("/api/comments", commentRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("IIIT-Una Feed Backend Running ✅");
});

module.exports = app;
