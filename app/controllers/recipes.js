const { validationResult } = require("express-validator");
const slugify = require("slugify");
const pool = require("../db");

exports.publishRecipe = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            msg: "Validation error",
            errors: errors.array()
        });
    }
    try {
        const {
            title,
            summary,
            content,
            image_url,
            subscriber_only = false,
        } = req.body;

        let slug = slugify(title, {
            lower: true,
            strict: true,
            trim: true
        });

        // handler for duplicate slugs
        const existingSlug = await pool.query(
            "SELECT id FROM recipes WHERE slug = $1",
            [slug]
        );

        if (existingSlug.rows.length > 0) {
            slug = `${slug}-${Date.now()}`;
        }

        const result = await pool.query(
            `INSERT INTO recipes
            (author_id, title, slug, summary, content, image_url, subscriber_only)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, author_id, title, slug, summary, content, image_url, subscriber_only, created_at, updated_at`,
            [
                req.user.id,
                title,
                slug,
                summary || null,
                content,
                image_url || null,
                subscriber_only,
            ]
        );

        return res.status(201).json({
            status: "success",
            msg: "Recipe created successfully.",
            recipe: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    }
}

exports.editRecipe = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            msg: "Validation error",
            errors: errors.array()
        });
    }

    try {
        const {
            title,
            summary,
            content,
            image_url
        } = req.body;

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    }
}

exports.loadRecipe = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            msg: "Validation error",
            errors: errors.array()
        });
    }
}