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
            RETURNING id, 
                author_id, 
                title, 
                slug, 
                summary, 
                content, 
                image_url, 
                subscriber_only, 
                created_at, 
                updated_at`,
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
};

exports.editRecipe = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            msg: "Validation error",
            errors: errors.array()
        });
    }

    const client = await pool.connect();

    try {
        const {
            title,
            summary,
            content,
            image_url
        } = req.body;

        const currentSlug = req.params.slug;

        await client.query("BEGIN");

        const currentResult = await client.query(
            "SELECT id FROM recipes WHERE slug = $1 and author_id = $2",
            [currentSlug, req.user.id]
        );

        if (currentResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                status: "error",
                msg: "Recipe not found or you lack permission to edit."
            });
        }
        const recipeId = currentResult.rows[0].id;

        let newSlug = slugify(title, {
            lower: true,
            strict: true,
            trim: true
        });
        
        // If someone manages to send a null title then this will throw an error
        if (!newSlug) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                status: "error",
                msg: "Invalid title for slug generation."
            });
        }

        // Set a variable for a slug that already exists and shares the name with the new slug
        const existingSlug = await client.query(
            "SELECT id FROM recipes WHERE slug = $1 AND id <> $2",
            [newSlug, recipeId]
        );
        // If this variable exists, add the date as a suffix on the new slug
        if (existingSlug.rows.length > 0) {
            newSlug = `${newSlug}-${Date.now()}`;
        }

        const result = await client.query(
            `UPDATE recipes
            SET title = $1,
                summary = $2,
                content = $3,
                image_url = $4,
                slug = $5,
                updated_at = NOW()
            WHERE id = $6
            RETURNING id, 
                author_id, 
                title, 
                slug, 
                summary, 
                content, 
                image_url, 
                subscriber_only, 
                created_at, 
                updated_at`,
            [
                title,
                summary || null,
                content,
                image_url || null,
                newSlug,
                recipeId
            ]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            status: "success",
            msg: "Recipe edited successfully.",
            recipe: result.rows[0]
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    } finally {
        client.release();
    }
};

exports.loadRecipe = async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await pool.query(
            `SELECT r.id,
                r.author_id,
                r.title,
                r.slug,
                r.summary,
                r.content,
                r.image_url,
                r.subscriber_only,
                r.created_at,
                r.updated_at,
                u.username
            FROM recipes r
            JOIN users u on r.author_id = u.id
            WHERE r.slug = $1`,
            [slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                msg: "Recipe not found."
            });
        }

        return res.status(200).json({
            status: "success",
            recipe: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    }
};

exports.loadAllRecipes = async (req, res) => {
    try { 
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = req.query.q?.trim() || "";
        const queryLimiter = limit + 1; 
        let result;

        if (search) {
            result = await pool.query(
                `SELECT r.id,
                    r.author_id,
                    r.title,
                    r.slug,
                    r.summary,
                    r.image_url,
                    r.subscriber_only,
                    r.created_at,
                    r.updated_at,
                    u.username
                FROM recipes r
                JOIN users u ON r.author_id = u.id
                WHERE r.title ILIKE $1
                    OR r.summary ILIKE $1
                    OR r.content ILIKE $1
                    OR u.username ILIKE $1
                ORDER BY r.created_at DESC
                LIMIT $2 OFFSET $3`,
                [`%${search}%`, queryLimiter, offset]
            );
        } else {
            result = await pool.query(
                `SELECT r.id,
                    r.author_id,
                    r.title,
                    r.slug,
                    r.summary,
                    r.image_url,
                    r.subscriber_only,
                    r.created_at,
                    r.updated_at,
                    u.username
                FROM recipes r
                JOIN users u ON r.author_id = u.id
                ORDER BY r.created_at DESC
                LIMIT $1 OFFSET $2`,
                [queryLimiter, offset]
            );
        }

        /* This is why we have the query limiter variable that is +1 of limit.
         If there is a next page, remove the last result from the array. */
        const hasNextPage = result.rows.length > limit;
        if (hasNextPage) {
            result.rows.pop();
        }

        return res.status(200).json({
            status: "success",
            count: result.rows.length,
            limit,
            offset,
            hasNextPage,
            recipes: result.rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    }
};

exports.loadMyRecipes = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = req.query.q?.trim() || "";
        const queryLimiter = limit + 1; 
        let result;

        if (search) {
            result = await pool.query(
                `SELECT r.id,
                    r.author_id,
                    r.title,
                    r.slug,
                    r.summary,
                    r.image_url,
                    r.subscriber_only,
                    r.created_at,
                    r.updated_at,
                    u.username
                FROM recipes r
                JOIN users u ON r.author_id = u.id
                WHERE r.author_id = $1
                AND (
                    r.title ILIKE $2
                    OR r.summary ILIKE $2
                    OR r.content ILIKE $2
                )
                ORDER BY r.created_at DESC
                LIMIT $3 OFFSET $4`,
                [req.user.id, `%${search}%`, queryLimiter, offset]
            );
        } else {
            result = await pool.query(
                `SELECT r.id,
                    r.author_id,
                    r.title,
                    r.slug,
                    r.summary,
                    r.image_url,
                    r.subscriber_only,
                    r.created_at,
                    r.updated_at,
                    u.username
                FROM recipes r
                JOIN users u on r.author_id = u.id
                WHERE r.author_ID = $1
                ORDER BY r.created_at DESC
                LIMIT $2 OFFSET $3`,
                [req.user.id, queryLimiter, offset]
            );
        }

        const hasNextPage = result.rows.length > limit;
        if (hasNextPage) {
            result.rows.pop();
        }
        return res.status(200).json({
            status: "success",
            count: result.rows.length,
            limit,
            offset,
            hasNextPage,
            recipes: result.rows
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    }
};

exports.deleteRecipe = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            msg: "Validation error", 
            errors: errors.array()
        });
    }

    try {
        const slug = req.params.slug;

        const result = await pool.query(
            `DELETE FROM recipes
            WHERE slug = $1 AND author_id = $2
            RETURNING id, title, slug`,
            [slug, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                msg: "Recipe not found or insufficient permissions."
            });
        }
        return res.status(200).json({
            status: "success",
            msg: "Recipe successfully deleted.",
            recipe: result.rows[0]
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: "error",
            msg: "Internal server error."
        });
    }
};