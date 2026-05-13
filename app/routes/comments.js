const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
    createComment,
    getCommentsByRecipe
} = require("../controllers/comments");

router.post(
    "/comments",
    passport.authenticate("jwt", { session: false }),
    createComment
);

router.get(
    "/recipes/:id/comments",
    getCommentsByRecipe
);

module.exports = router;