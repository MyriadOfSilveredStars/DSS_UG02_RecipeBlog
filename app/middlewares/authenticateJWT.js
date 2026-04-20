const passport = require("passport");

const authenticateJWT = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({message: "Internal server error."});
        }
        if (!user) {
            if (info?.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Token expired, you must log in again."
                });
            }
            if (info?.message === "No auth token") {
                return res.status(401).json({
                    message: "No token was provided."
                });
            }

            return res.status(401).json({
                message: "Invalid token" 
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
module.exports = authenticateJWT;