const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");


require("dotenv").config();

exports.register = async (req, res) => {
    const errors = validationResult(req);

    console.log(req.body);

    // Return any validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            msg: "Validation error",
            errors: errors.array()
        });
    }
    try {
        const { username, email, password } = JSON.parse(req.body);
        console.log("Password from auth.js: " + password);

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
        `INSERT INTO users (full_name, username, email, password_hash)
        VALUES ($1, $1, $2, $3)
        RETURNING id, username, email`,
        [username, email, hashedPassword]
        );
        const newUser = newUserResult.rows[0];

        // Create a JWT
        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION_TIME, }
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
        const { email, password } = req.body;

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
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION_TIME, }
        );
        return res.status(200).json({
            status: "success",
            msg: "Login successful.",
            user: {
                username: user.username,
                email: user.email,
                token
            }
        });
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