const passport = require("passport");

const authenticateJWT = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        //console.log("auth err:", err);
        //console.log("auth user:", user); //removing these for demo
        //console.log("auth info:", info);
        if (err) {
            return res.status(500).json({msg: "Internal server error."});
        }
        if (!user) {
            if (info?.name === "TokenExpiredError") {
                return res.status(401).json({
                    msg: "Token expired, you must log in again."
                });
            }
            if (info?.message === "No auth token") {
                return res.status(401).json({
                    msg: "No token was provided."
                });
            }

            return res.status(401).json({
                msg: "Invalid token" 
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
module.exports = authenticateJWT;