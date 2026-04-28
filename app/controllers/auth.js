const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const { resend } = require("../config/email");
const mfaStore = require("../config/mfaStore");

//sanitisation
const sanitisation = require('../public/js/sanitisation');


require("dotenv").config();

exports.register = async (req, res) => {
    const errors = validationResult(req);

    // Return any validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            msg: "Validation error",
            errors: errors.array()
        });
    }
    try {
        var { username, email, password } = req.body;

        //sanitise the sign up info
        username = sanitisation(username);
        email = sanitisation(email);
        password = sanitisation(password);

        if (username == "" || email == "" || password == ""){ //don't allow empty values
            return res.status(422).json({
                status: "error",
                msg : "Missing information" //but be vague as to which values are empty
            }) //this is mostly because my unit tests bypass the html enforcements
        }

        // Does this user's email exist already?
        const existingUser = await pool.query(
            "SELECT id from users WHERE email = $1",
            [email]
        );
        if (existingUser.rows.length > 0) {
            // One could argue this poses a security risk in fact threat actors could use this error to make compile a list of emails in use, but this is also a UX issue.
            return res.status(409).json({
                status: "error",
                msg: "Unable to create an account.",
            });
        }
        // Hash
        const hashedPassword = await bcrypt.hash(password, 12);
        // Add new user into the table.
        const newUserResult = await pool.query(
        `INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email`,
        [username, email, hashedPassword]
        );
        const newUser = newUserResult.rows[0];

        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION_TIME }
        );
        return res.status(201).json({
            status: "success",
            msg: "Account successfully created.",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                token,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal server error.",
            errors: error.message,
        });
    }
}

exports.login = async (req, res) => {
    const errors = validationResult(req);
    // Return any validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            msg: 'Validation error',
            errors: errors.array()
        });
    }
    try {
        var { email, password } = req.body;
        //sanitise login attempts
        email = sanitisation(email);
        password = sanitisation(password);

        console.log("Login controller reached for:", email);

        const result = await pool.query(
            "SELECT id, username, email, password_hash FROM users WHERE email = $1",
            [email]
        );
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({
                status: "error",
                // Don't get more specific than this so usernames and passwords cant be guessed
                msg: "Invalid credentials",
                errors: [{ msg: "Invalid credentials" }]
            });
        }
        // Create a token for the user

        // const token = jwt.sign(
        //     { id: user.id },
        //     process.env.JWT_SECRET_KEY,
        //     { expiresIn: process.env.JWT_EXPIRATION_TIME, }
        // );
        // return res.status(200).json({
        //     status: "success",
        //     msg: "Login successful.",
        //     user: {
        //         username: user.username,
        //         email: user.email,
        //         token
        //     }
        // });

        //start MFA
        //generate 6 digit MFA code
        const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Generating MFA code:", mfaCode);

        //store code with 5 minute expiry
        mfaStore.set(email, {
            code: mfaCode,
            expiresAt: Date.now() + 5 * 60 * 1000,
            userId: user.id,
            username: user.username
        });

        // Send email
        try {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Your login code",
                text: `Your verification code is: ${mfaCode}. It expires in 5 minutes.`
            });
            console.log(`MFA code sent to ${email}`);
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
            console.log(`MFA code for ${email}: ${mfaCode}`);
        }

        return res.status(200).json({
            status: "mfa_required",
            msg: "Verification code sent to your email."
        });
        //end MFA
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: error.message,
            msg: "Internal server error."
        });
    }
}

// a route that only authenticated users can go through.
exports.dashboard = async (req, res) => {
    return res.status(200).json({
        msg: "This is the Dashboard Page."
    });
};

exports.verifyMfa = async (req, res) => {
    try {
        var { email, code } = req.body;

        //sanitise these too i guess
        email = sanitisation(email);
        code = sanitisation(code);

        // Look up pending MFA entry
        const entry = mfaStore.get(email);

        if (!entry) {
            return res.status(401).json({
                status: "error",
                msg: "No pending verification for this email."
            });
        }

        if (Date.now() > entry.expiresAt) {
            mfaStore.delete(email);
            return res.status(401).json({
                status: "error",
                msg: "Verification code has expired. Please log in again."
            });
        }

        if (code !== entry.code) {
            return res.status(401).json({
                status: "error",
                msg: "Incorrect verification code."
            });
        }

        // All checks passed — now create the JWT
        mfaStore.delete(email);

        const token = jwt.sign(
            { id: entry.userId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION_TIME }
        );

        return res.status(200).json({
            status: "success",
            msg: "Login successful.",
            user: {
                username: entry.username,
                email: email,
                token
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    }
};