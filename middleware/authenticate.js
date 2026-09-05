const jwt = require("jsonwebtoken");

authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization token required",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    const { user } = req;

    if (!roles.includes(user?.role)) {
      return res
        .status(401)
        .json({ message: "User unauthorized to carry out this action" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
