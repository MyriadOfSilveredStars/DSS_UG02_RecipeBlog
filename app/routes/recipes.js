const { Router } = require("express");
const { body } = require("express-validator");
const authenticateJWT = require("../middlewares/authenticateJWT");
const { publishRecipe, editRecipe, loadRecipe, loadAllRecipes, deleteRecipe, loadMyRecipes } = require("../controllers/recipes");

const router = Router();

const validateRecipe = [
    body("title").trim()
    .notEmpty()
    .withMessage("The recipe must have a title")
    .isLength({ min: 1, max: 150 }).withMessage("The title must be between 1 and 150 characters"),

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

router.post("/recipes", validateRecipe, authenticateJWT, publishRecipe);
router.put("/recipes/:slug", validateRecipe, authenticateJWT, editRecipe);
router.delete("/recipes/:slug", authenticateJWT, deleteRecipe);
router.get("/recipes", loadAllRecipes);
router.get("/recipes/my-recipes", authenticateJWT, loadMyRecipes);
router.get("/recipes/:slug", loadRecipe);

module.exports = router;