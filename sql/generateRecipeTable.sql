CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    subscriber_only BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_recipes_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);