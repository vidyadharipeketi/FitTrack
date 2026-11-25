const jwt = require("jsonwebtoken");

// ================= VERIFY TOKEN =================
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Store user details in request
      req.user = decoded;

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// ================= ADMIN ONLY =================
const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }
};

// ================= TRAINER ONLY =================
const isTrainer = (req, res, next) => {
  if (req.user.role === "trainer") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Trainer only."
    });
  }
};

// ================= MEMBER ONLY =================
const isMember = (req, res, next) => {
  if (req.user.role === "member") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Member only."
    });
  }
};

module.exports = {
  protect,
  isAdmin,
  isTrainer,
  isMember
};