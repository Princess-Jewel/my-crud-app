
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error("User is not authorized")); // Only call next without sending a response
            }
            req.user = decoded;
            next(); // Continue with the next middleware
        });
    } else {
        return next(new Error("Token is missing")); // Only call next without sending a response
    }
});

module.exports = validateToken;

