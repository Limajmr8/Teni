-- TENI: Create Supabase Storage Bucket for Product Images

-- 1. Insert the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE 
SET public = true, file_size_limit = 5242880;

-- 2. Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- 3. Create policies for the bucket
-- Anyone can view
CREATE POLICY "Public View Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Any logged in user (seller) can upload
CREATE POLICY "Authenticated Users Can Upload Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-images' );

-- Sellers can update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'product-images' AND owner = auth.uid() );

-- Sellers can delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'product-images' AND owner = auth.uid() );
