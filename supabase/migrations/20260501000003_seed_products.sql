-- Seed file: Marketplace seller products
-- This adds real products linked to seller_profiles so the homepage has items to display

DO $$
DECLARE
    v_town_id UUID;
    v_seller_id UUID;
    v_cat_id UUID;
BEGIN
    SELECT id INTO v_town_id FROM towns WHERE slug = 'mokokchung' LIMIT 1;
    
    IF v_town_id IS NULL THEN
        RAISE NOTICE 'Town Mokokchung not found, skipping seed.';
        RETURN;
    END IF;

    -- Create a demo seller if none exists
    SELECT user_id INTO v_seller_id FROM seller_profiles WHERE is_approved = true LIMIT 1;
    
    IF v_seller_id IS NULL THEN
        -- Insert demo user and seller
        INSERT INTO users (id, phone, full_name, roles) VALUES 
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '+919876543210', 'Mary Longchar', ARRAY['seller']::text[])
        ON CONFLICT (id) DO NOTHING;
        
        INSERT INTO seller_profiles (user_id, town_id, store_name, store_slug, bio, village_origin, locality, is_approved, plan, rating, category)
        VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', v_town_id, 'Mary''s Kitchen', 'marys-kitchen', 
                'Traditional Ao Naga recipes passed down through generations. Everything is made fresh with locally sourced ingredients.',
                'Ungma', 'Mokokchung Town', true, 'pro', 4.9, 'Food & Beverages')
        ON CONFLICT (user_id) DO UPDATE SET is_approved = true;
        
        v_seller_id := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    END IF;

    -- Get or create a product category
    SELECT id INTO v_cat_id FROM product_categories LIMIT 1;
    
    IF v_cat_id IS NULL THEN
        INSERT INTO product_categories (name, slug, icon_url) VALUES 
        ('Smoked Meats', 'smoked-meats', null),
        ('Pickles & Chutneys', 'pickles-chutneys', null),
        ('Rice & Grains', 'rice-grains', null),
        ('Fresh Produce', 'fresh-produce', null)
        RETURNING id INTO v_cat_id;
    END IF;

    -- Insert marketplace products for the seller
    INSERT INTO products (seller_id, category_id, name, description, price, unit, images, village_origin, story, stock_quantity, is_made_to_order, is_active) VALUES
    (v_seller_id, v_cat_id, 'Smoked Pork — Traditional Hearth-Dried', 
     'Authentic Naga smoked pork, slow-dried over a wood fire for 3 days. Rich, smoky flavor perfect for stews and curries.', 
     45000, '500g', 
     ARRAY['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400&auto=format&fit=crop'],
     'Ungma', 'Our family has been smoking pork the traditional way for over 50 years. Each batch is prepared with love and patience.', 
     25, false, true),
    
    (v_seller_id, v_cat_id, 'Naga King Chili Hot Sauce', 
     'Made from the legendary Bhut Jolokia (Ghost Pepper). Extremely spicy! Use sparingly.', 
     25000, '200ml', 
     ARRAY['https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400&auto=format&fit=crop'],
     'Mokokchung Town', 'We grow our own King Chilis organically and hand-make each bottle of sauce.', 
     40, false, true),
    
    (v_seller_id, v_cat_id, 'Bamboo Shoot Pickle — Fermented', 
     'Traditional fermented bamboo shoot pickle. A staple condiment in Naga cuisine.', 
     15000, '250g', 
     ARRAY['https://images.unsplash.com/photo-1607530542923-dc0a58811db0?q=80&w=400&auto=format&fit=crop'],
     'Ungma', 'Fermented for 2 weeks using our grandmother''s secret recipe.', 
     30, false, true),
    
    (v_seller_id, v_cat_id, 'Sticky Rice — Locally Grown', 
     'Premium glutinous rice from the terraced fields of Mokokchung. Perfect for traditional dishes.', 
     18000, '1kg', 
     ARRAY['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop'],
     'Longkhum', 'Grown on our family''s terrace farm at 1500m elevation.', 
     50, false, true),

    (v_seller_id, v_cat_id, 'Axone (Fermented Soybean)', 
     'Traditional Naga fermented soybean cake. Essential for authentic Naga cooking.', 
     12000, '200g', 
     ARRAY['https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop'],
     'Ungma', 'Prepared the traditional way — soybeans wrapped in banana leaves and fermented for a week.', 
     35, false, true),

    (v_seller_id, v_cat_id, 'Naga Tree Tomato Chutney', 
     'Sweet and tangy chutney made from the unique Naga tree tomato. Great with rice and meat.', 
     10000, '250ml', 
     ARRAY['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop'],
     'Mokokchung Town', 'A family recipe that''s been perfected over three generations.', 
     45, false, true)
    ON CONFLICT DO NOTHING;

END $$;
