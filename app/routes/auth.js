const { Router } = require("express");
const { body } = require("express-validator");
const authenticateJWT = require("../middlewares/authenticateJWT");
const rateLimiter = require("../middlewares/loginLimit");
const { register, login, dashboard, verifyMfa } = require("../controllers/auth");

const router = Router();

const validateRegister = [
    body("username").isLength({min: 4 })
    .notEmpty()
    .withMessage("Please enter a username with at least 4 characters")
    .trim().escape(),

    body("email").isEmail()
    .notEmpty()
    .withMessage("Please enter a valid email address.")
    .trim().escape(),

    body('password').isLength({ min: 8 })
    .withMessage('Your password must be at least 8 characters long.')
    .trim().escape(),
];
router.post('/register', validateRegister, register);

const validateLogin = [
    body("email").isEmail().notEmpty().withMessage("Please enter a valid email address.").trim().escape(),
    body("password").notEmpty().withMessage("Please enter a password.").trim().escape(),
]
router.post("/login", rateLimiter, validateLogin, login);

router.get('/dashboard', authenticateJWT, dashboard);

router.post("/verify-mfa", verifyMfa);

module.exports = router;