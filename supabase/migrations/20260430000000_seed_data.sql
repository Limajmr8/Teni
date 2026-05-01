-- Seed file: 20 realistic SKUs across categories
-- Needs to fetch the town_id for Mokokchung

DO $$
DECLARE
    v_town_id UUID;
    v_staff_id UUID;
BEGIN
    SELECT id INTO v_town_id FROM towns WHERE slug = 'mokokchung' LIMIT 1;
    
    IF v_town_id IS NULL THEN
        RAISE NOTICE 'Town Mokokchung not found, skipping seed.';
        RETURN;
    END IF;

    -- Insert 20 SKUs into the dark store
    -- 1. Groceries & Essentials
    INSERT INTO skus (town_id, name, description, category, unit, purchase_price, selling_price, is_active) VALUES
    (v_town_id, 'Amul Taaza Toned Milk', 'Fresh toned milk in tetra pack', 'Groceries', '1L', 6500, 7200, true),
    (v_town_id, 'Aashirvaad Whole Wheat Atta', 'Premium quality wheat flour', 'Groceries', '5kg', 22000, 24500, true),
    (v_town_id, 'Fortune Sunlite Refined Oil', 'Sunflower oil', 'Groceries', '1L', 14000, 15500, true),
    (v_town_id, 'Tata Salt', 'Iodized salt', 'Groceries', '1kg', 2400, 2800, true),
    (v_town_id, 'Maggi 2-Minute Noodles', 'Masala noodles', 'Snacks', '140g', 2800, 3000, true),
    (v_town_id, 'Farm Fresh Eggs', 'Locally sourced fresh eggs', 'Groceries', '12 pieces', 8500, 10000, true),
    (v_town_id, 'Amul Butter', 'Pasteurised butter', 'Groceries', '100g', 5600, 6000, true),
    (v_town_id, 'Lays India''s Magic Masala', 'Potato chips', 'Snacks', '50g', 2000, 2000, true),
    (v_town_id, 'Britannia Good Day Cookies', 'Butter cookies', 'Snacks', '200g', 3500, 4000, true),
    (v_town_id, 'Coca Cola', 'Carbonated soft drink', 'Beverages', '750ml', 4000, 4500, true),
    (v_town_id, 'Red Bull Energy Drink', 'Energy drink', 'Beverages', '250ml', 11500, 12500, true),
    (v_town_id, 'Tata Tea Premium', 'Assam tea leaves', 'Groceries', '500g', 23000, 25000, true),
    (v_town_id, 'Nescafe Classic Coffee', 'Instant coffee powder', 'Groceries', '50g', 15500, 17000, true),
    (v_town_id, 'Surf Excel Easy Wash', 'Detergent powder', 'Household', '1kg', 11500, 13000, true),
    (v_town_id, 'Vim Dishwash Gel', 'Lemon dishwash liquid', 'Household', '250ml', 5500, 6000, true),
    (v_town_id, 'Dettol Antiseptic Liquid', 'First aid antiseptic liquid', 'Household', '125ml', 6500, 7000, true),
    (v_town_id, 'Colgate MaxFresh', 'Toothpaste', 'Personal Care', '150g', 9500, 11000, true),
    (v_town_id, 'Lifebuoy Total Soap', 'Antibacterial soap', 'Personal Care', '100g', 3000, 3500, true),
    (v_town_id, 'Gillette Mach3 Razor', 'Men''s shaving razor', 'Personal Care', '1 piece', 24000, 26000, true),
    (v_town_id, 'Whisper Ultra Clean', 'Sanitary pads', 'Personal Care', '15 pieces', 15000, 17500, true);

    -- Also add initial inventory for all these SKUs
    INSERT INTO inventory (sku_id, quantity, shelf_code)
    SELECT id, 50, 'A1-' || substring(id::text from 1 for 4)
    FROM skus WHERE town_id = v_town_id;

END $$;
