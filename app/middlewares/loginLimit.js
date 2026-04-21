const { rateLimit } = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429, // Too many requests sent
    message: "You have sent too many requests at once! Please wait 5 minutes."
});

module.exports = rateLimiter;