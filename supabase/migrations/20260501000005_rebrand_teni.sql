-- TENI Rebrand: Fix database-level BAZAR references

-- 1. Rename fulfillment_model enum value
ALTER TYPE fulfillment_model RENAME VALUE 'bazar_runner' TO 'teni_runner';

-- 2. Rename buyer_profiles column
ALTER TABLE buyer_profiles RENAME COLUMN bazar_credits TO teni_credits;

-- 3. Update schema comment
COMMENT ON TABLE buyer_profiles IS 'Buyer profiles with TENI credits and default addresses';
