const { Router } = require("express");
const { body } = require("express-validator");
const authenticateJWT = require("../middlewares/authenticateJWT");
const { publishRecipe } = require("../controllers/recipes");
const { editRecipe } = require("../controllers/recipes");
const { loadRecipe } = require("../controllers/recipes");

const router = Router();

const validateRecipe = [
    body("title").trim()
    .notEmpty()
    .withMessage("The recipe must have a title")
    .isLength({ min: 10, max: 150 }).withMessage("The title must be between 10 and 150 characters"),

    body("content")
    .trim()
    .notEmpty().withMessage("Content is required."),

    body("summary")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage("Please use no more than 500 words in the summary."),

    body("image_url")
    .optional({ checkFalsy: true })
    .trim()
    .isURL().withMessage("Please use a valid URL for the image upload."),

    body("subscriber_only")
    .optional()
    .isBoolean().withMessage("subscriber_only must be true or false.")
];

router.post("/publishrecipe", validateRecipe, authenticateJWT, publishRecipe);
// up in the air on if i repeat the use of validateRecipe for editing recipes, but we'll see how it goes.
router.post("/editrecipe", validateRecipe, authenticateJWT, publishRecipe);
router.post("/loadrecipe", loadRecipe);

module.exports = router;