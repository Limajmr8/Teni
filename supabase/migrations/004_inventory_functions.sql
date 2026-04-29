CREATE OR REPLACE FUNCTION decrement_inventory(p_sku_id UUID, p_amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE inventory
  SET quantity_in_stock = quantity_in_stock - p_amount,
      updated_at = NOW()
  WHERE sku_id = p_sku_id
    AND quantity_in_stock >= p_amount;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql;
