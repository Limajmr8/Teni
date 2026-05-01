-- Seed file: Heritage Marketplace Artisans and Products

DO $$
DECLARE
    v_user_id1 UUID;
    v_user_id2 UUID;
    v_artisan_id1 UUID;
    v_artisan_id2 UUID;
BEGIN
    -- 1. Create Users for Artisans
    INSERT INTO auth.users (id, email) VALUES 
    (uuid_generate_v4(), 'imna@bazar.local'),
    (uuid_generate_v4(), 'ato@bazar.local')
    RETURNING id INTO v_user_id1;

    SELECT id INTO v_user_id2 FROM auth.users WHERE email = 'ato@bazar.local';

    INSERT INTO users (id, phone, full_name, roles) VALUES 
    (v_user_id1, '+919800000001', 'Imna Longchar', '{seller}'),
    (v_user_id2, '+919800000002', 'Ato Sema', '{seller}');

    -- 2. Create Artisan Profiles
    INSERT INTO artisan_profiles (user_id, artisan_name, tribe, village, district, craft_type, bio, portrait_url, is_bazar_verified, avg_rating, total_products_sold) VALUES
    (v_user_id1, 'Imna Longchar', 'Ao Naga', 'Ungma', 'Mokokchung', 'Traditional Weaving', 'Third-generation weaver from Ungma village.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', true, 4.9, 12)
    RETURNING id INTO v_artisan_id1;

    INSERT INTO artisan_profiles (user_id, artisan_name, tribe, village, district, craft_type, bio, portrait_url, is_bazar_verified, avg_rating, total_products_sold) VALUES
    (v_user_id2, 'Ato Sema', 'Sema Naga', 'Zunheboto', 'Zunheboto', 'Smoked Meats', 'Specializing in traditional hearth-dried smoked pork.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', true, 4.8, 8)
    RETURNING id INTO v_artisan_id2;

    -- 3. Create Heritage Products
    INSERT INTO heritage_products (artisan_id, name, slug, category, artisan_price, selling_price, compare_at_price, gi_tag_status, gi_tag_name, images, origin_village, origin_district, status) VALUES
    (v_artisan_id1, 'Ao Naga Warrior Shawl', 'ao-naga-warrior-shawl', 'Heritage Textiles', 350000, 499900, 699900, 'registered', 'Chakhesang Shawls', ARRAY['https://images.unsplash.com/photo-1583743089695-4b816a340f82?q=80&w=400&auto=format&fit=crop'], 'Ungma', 'Mokokchung', 'active'),
    (v_artisan_id2, 'Smoked Pork — Traditional Hearth-Dried', 'smoked-pork-traditional', 'Smoked & Cured Meats', 50000, 79900, NULL, 'bazar_verified', NULL, ARRAY['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400&auto=format&fit=crop'], 'Zunheboto', 'Zunheboto', 'active');

END $$;
