const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const passport = require("passport");
const pool = require("../db");

require("dotenv").config();

let options = { 
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email FROM users WHERE id = $1",
            [jwt_payload.id]
        );
        const user = result.rows[0];

        if (!user) {
            return done(null, false);
        }

        // If successful then return the user
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));
module.exports = passport;