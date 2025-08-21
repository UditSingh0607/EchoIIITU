// middleware/deviceId.js
const { v4: uuidv4 } = require("uuid");

function assignDeviceId(req, res, next) {
  if (!req.cookies.deviceId) {
    const deviceId = uuidv4();  // generate new
    res.cookie("deviceId", deviceId, {
      httpOnly: true,
      secure: false,   // change to true if you’re using HTTPS in prod
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });
    req.deviceId = deviceId;   // set it for current request
  } else {
    req.deviceId = req.cookies.deviceId; // reuse existing
  }
  next();
}

module.exports = assignDeviceId;
