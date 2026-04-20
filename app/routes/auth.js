const { Router } = require("express");
const { body } = require("express-validator");
const { register } = require("../controllers/auth");
const { login } = require("../controllers/auth");
const authenticateJWT = require("../middlewares/authenticateJWT");
const { dashboard } = require("../controllers/auth");
const router = Router();

const validateRegister = [
    body("username").isLength({min: 4 }).notEmpty().withMessage("Please enter a username with at least 4 characters").trim().escape(),
    body("email").isEmail().notEmpty().withMessage("Please enter a valid email address.").trim().escape(),
    body('password').isLength({ min: 8 }).withMessage('Your password must be at least 8 characters long.').trim().escape(),
];
router.post('/register', validateRegister, register);

const validateLogin = [
    body("email").isEmail().notEmpty().withMessage("Please enter a valid email address.").trim().escape(),
    body("password").notEmpty().withMessage("Please enter a password.").trim().escape(),
]
router.post("/login", validateLogin, login);

router.get('/dashboard', authenticateJWT, dashboard);

module.exports = router;