-- Fix: Add missing columns and disable RLS for prototyping
-- The seller_profiles table needs a category column
-- And RLS needs to be fully open for the demo

-- Add category column if missing
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS category TEXT;

-- Disable RLS on all tables for prototyping (re-enable for production)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE sub_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE parent_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE skus DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE runner_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE punch_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Drop the foreign key constraint on users.id -> auth.users.id for demo
-- This allows creating demo users without going through Supabase Auth
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Make phone column nullable for demo users
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;

-- Drop unique constraint on phone if exists (for demo)  
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_key;
