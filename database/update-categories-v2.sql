-- Migration v2: Update category names and add new categories
-- Run: psql -d yourdb -f database/update-categories-v2.sql

BEGIN;

-- 1. Rename "Исхрана и здравје" -> "Исхрана" (update both name and slug)
UPDATE categories
SET name = 'Исхрана', slug = 'ishrana'
WHERE slug = 'ishrana-i-zdravje';

-- 2. Keep "Медицински технологии" as-is (slug: medicinski-tehnologii)
-- No change needed

-- 3. Add new categories (IF NOT EXISTS by slug)
INSERT INTO categories (name, slug)
SELECT 'Имунология', 'imunologija'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'imunologija');

INSERT INTO categories (name, slug)
SELECT 'Ендокринологија', 'endokrinologija'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'endokrinologija');

INSERT INTO categories (name, slug)
SELECT 'Фитнес и Превенција', 'fitnes-i-prevencija'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'fitnes-i-prevencija');

INSERT INTO categories (name, slug)
SELECT 'Генетика', 'genetika'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'genetika');

INSERT INTO categories (name, slug)
SELECT 'Фармакологија', 'farmakologija'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'farmakologija');

INSERT INTO categories (name, slug)
SELECT 'Јавно Здравје', 'javno-zdravje'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'javno-zdravje');

COMMIT;
