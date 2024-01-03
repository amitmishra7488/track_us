const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized", reason: "Token not provided" });
    }

    const verify = await jwt.verify(token, process.env.MYSECRETKEY);
    if (!verify) {
      return res
        .status(401)
        .json({ error: "Unauthorized", reason: "Invalid token" });
    }

    req.userId = verify.id;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", reason: error.message });
  }
};

module.exports = auth;
