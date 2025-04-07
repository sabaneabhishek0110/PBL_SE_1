const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const userMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const authToken = token.split(" ")[1];
  // console.log("Extracted Token:", authToken);
  try {
    console.log("Entered into userMiddleware in userMiddleware.js");

    // console.log("Headers:", req.headers);

    const decoded = jwt.verify(authToken, JWT_SECRET); 
    // console.log("Decoded token:", decoded);

    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token: userId missing" });
    }

    req.user = decoded;
    // console.log("User get added to req");

    console.log("completed userMiddleware in userMiddleware.js");
    next();

  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = userMiddleware;
