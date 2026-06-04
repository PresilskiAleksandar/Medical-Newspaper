-- Add image column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image VARCHAR(500);

-- Set category images
UPDATE categories SET image = '/uploads/cat-general.jpg' WHERE slug = 'opsta-medicina';
UPDATE categories SET image = '/uploads/cat-cardio.jpg' WHERE slug = 'kardiologija';
UPDATE categories SET image = '/uploads/cat-neuro.jpg' WHERE slug = 'nevrologija';
UPDATE categories SET image = '/uploads/cat-pediatrics.jpg' WHERE slug = 'pedijatrija';
UPDATE categories SET image = '/uploads/cat-oncology.jpg' WHERE slug = 'onkologija';
UPDATE categories SET image = '/uploads/cat-psychiatry.jpg' WHERE slug = 'psihijatrija';
UPDATE categories SET image = '/uploads/cat-dental.jpg' WHERE slug = 'stomatologija';
UPDATE categories SET image = '/uploads/cat-pharmacy.jpg' WHERE slug = 'farmacija';
UPDATE categories SET image = '/uploads/cat-nutrition.jpg' WHERE slug = 'ishrana-i-zdravje';
UPDATE categories SET image = '/uploads/cat-medtech.jpg' WHERE slug = 'medicinski-tehnologii';
UPDATE categories SET image = '/uploads/cat-infectious.jpg' WHERE slug = 'infektivni-bolesti';
UPDATE categories SET image = '/uploads/cat-occupational.jpg' WHERE slug = 'medicina-na-trud';
