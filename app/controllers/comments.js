const pool = require("../db");

const createComment = async (req, res) => {
    const { recipe_id, content } = req.body;
    const authorId = req.user.id;

    try {
        const result = await pool.query(
            `INSERT INTO comments (author_id, recipe_id, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [authorId, recipe_id, content]
        );

        res.status(201).json({ comment: result.rows[0] });
    } catch (err) {
        console.error("Error saving comment:", err);
        res.status(500).json({ msg: "Failed to save comment." });
    }
};

const getCommentsByRecipe = async (req, res) => {
    const recipeId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT c.id, c.content, c.created_at, u.username
             FROM comments c
             JOIN users u ON c.author_id = u.id
             WHERE c.recipe_id = $1
             ORDER BY c.created_at DESC`,
            [recipeId]
        );

        res.json({ comments: result.rows });
    } catch (err) {
        console.error("Error loading comments:", err);
        res.status(500).json({ msg: "Failed to load comments." });
    }
};

module.exports = {
    createComment,
    getCommentsByRecipe
};