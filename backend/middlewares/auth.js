const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authentication = async (req, res, next) => {
  const token = req.cookies.userToken;

  // Check if the token is present
  if (!token) {
    return res.status(401).json({
      message: "Token Missing",
    });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token data to the request object
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({
      message: "Token is invalid",
    });
  }
};
