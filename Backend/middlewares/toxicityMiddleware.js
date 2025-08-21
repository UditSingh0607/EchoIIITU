const checkToxicity = require("../utils/toxicityChecker");

async function toxicityMiddleware(req, res, next) {
  try {
    const text = req.body.content || req.body.text;
    if (!text) {
      req.toxicity = null; // nothing to check
      return next();
    }

    const toxicityScore = await checkToxicity(text);
    req.toxicity = toxicityScore; // 👈 attach here

    next(); // pass control to next middleware/route
  } catch (err) {
    console.error("❌ Error in toxicityMiddleware:", err);
    req.toxicity = null; // fallback
    next();
  }
}

module.exports = toxicityMiddleware;
