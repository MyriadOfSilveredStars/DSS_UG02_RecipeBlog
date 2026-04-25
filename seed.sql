/*
CMP-6045B Developing Secure Software
Assessment 002

File: seed.sql

Purpose:
This .sql file deletes any existing data from tables, resets IDs 
so they start from 1 again and then inserts test data into the
tables. Running this in psql resets the database to this seed. 
*/

-- Clear existing test data in the right order
DELETE FROM comments;
DELETE FROM paymentinfo;
DELETE FROM recipes;
DELETE FROM users;

-- Reset IDs so they start from 1 again
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE comments_id_seq RESTART WITH 1;
ALTER SEQUENCE paymentinfo_id_seq RESTART WITH 1;

-- Users
INSERT INTO users (full_name, username, email, password_hash, is_subscriber, role)
VALUES
('Jay Groom', 'jaygroom', 'jay@example.com', '$argon2id$v=19$m=65536,t=3,p=4$examplehash1', true, 'admin'),
('Alice Smith', 'alicesmith', 'alice@example.com', '$argon2id$v=19$m=65536,t=3,p=4$examplehash2', false, 'user'),
('Ben Carter', 'bencarter', 'ben@example.com', '$argon2id$v=19$m=65536,t=3,p=4$examplehash3', true, 'user');

-- Recipes
INSERT INTO recipes (author_id, title, slug, summary, content, image_url, subscriber_only, is_published)
VALUES
(1, 'Student Pasta Bake', 'student-pasta-bake', 'Cheap, easy and filling pasta bake.', 'Cook pasta, mix with sauce, add cheese, bake until golden.', 'https://example.com/pasta-bake.jpg', false, true),
(1, 'High Protein Meal Prep Bowls', 'high-protein-meal-prep-bowls', 'Simple meal prep for busy students.', 'Cook rice, chicken and vegetables. Portion into containers.', 'https://example.com/meal-prep.jpg', true, true),
(2, 'Budget Bean Chilli', 'budget-bean-chilli', 'Low-cost chilli using cupboard ingredients.', 'Fry onion, add beans, tomatoes and seasoning, simmer well.', 'https://example.com/chilli.jpg', false, true),
(3, 'Creamy Subscriber Mac and Cheese', 'subscriber-mac-and-cheese', 'Premium comfort food recipe.', 'Make cheese sauce, stir through pasta, bake with topping.', 'https://example.com/mac-cheese.jpg', true, true);

-- Comments
INSERT INTO comments (author_id, content, created_at)
VALUES
(2, 'Love this idea for the blog.', NOW()),
(3, 'The pasta bake recipe looks great.', NOW()),
(1, 'Need to add more vegetarian recipes.', NOW());

-- Payment info
INSERT INTO paymentinfo (full_name, email, cardnum, sortcode, seccode)
VALUES
('Alice Smith', 'alice@example.com', 1111222233334444, 000000, 123),
('Ben Carter', 'ben@example.com', 5555666677778888, 111111, 456);