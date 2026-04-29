ALTER TABLE towns ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE runner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE runner_location_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE punch_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE town_ambassadors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_role(role_name TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role_name = ANY(roles)
  );
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT is_role('admin');
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_warehouse_staff()
RETURNS BOOLEAN AS $$
  SELECT is_role('warehouse_staff') OR is_role('admin');
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE POLICY "towns_public_read" ON towns FOR SELECT USING (true);
CREATE POLICY "towns_admin_write" ON towns FOR ALL USING (is_admin());

CREATE POLICY "config_public_read" ON config FOR SELECT USING (true);
CREATE POLICY "config_admin_write" ON config FOR ALL USING (is_admin());

CREATE POLICY "categories_public_read" ON product_categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON product_categories FOR ALL USING (is_admin());

CREATE POLICY "users_own_read" ON users FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "users_own_update" ON users FOR UPDATE USING (id = auth.uid() OR is_admin());
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "buyer_profiles_own" ON buyer_profiles FOR ALL USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "seller_profiles_public_read" ON seller_profiles FOR SELECT USING (is_active = true OR user_id = auth.uid() OR is_admin());
CREATE POLICY "seller_profiles_own_write" ON seller_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "seller_profiles_own_update" ON seller_profiles FOR UPDATE USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "runner_profiles_own" ON runner_profiles FOR ALL USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "warehouse_staff_read" ON warehouse_staff FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "warehouse_staff_admin" ON warehouse_staff FOR ALL USING (is_admin());

CREATE POLICY "skus_public_read" ON skus FOR SELECT USING (is_active = true OR is_warehouse_staff());
CREATE POLICY "skus_warehouse_write" ON skus FOR ALL USING (is_warehouse_staff());

CREATE POLICY "inventory_public_read" ON inventory FOR SELECT USING (true);
CREATE POLICY "inventory_warehouse_write" ON inventory FOR ALL USING (is_warehouse_staff());

CREATE POLICY "purchase_orders_staff" ON purchase_orders FOR ALL USING (is_warehouse_staff());

CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = true AND is_approved = true OR seller_id = auth.uid() OR is_admin());
CREATE POLICY "products_seller_write" ON products FOR INSERT WITH CHECK (seller_id = auth.uid());
CREATE POLICY "products_seller_update" ON products FOR UPDATE USING (seller_id = auth.uid() OR is_admin());
CREATE POLICY "products_admin_delete" ON products FOR DELETE USING (is_admin());

CREATE POLICY "parent_orders_buyer_read" ON parent_orders FOR SELECT USING (buyer_id = auth.uid() OR is_admin() OR is_warehouse_staff());
CREATE POLICY "parent_orders_buyer_insert" ON parent_orders FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "parent_orders_admin_update" ON parent_orders FOR UPDATE USING (is_admin() OR is_warehouse_staff());

CREATE POLICY "sub_orders_read" ON sub_orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM parent_orders WHERE id = sub_orders.parent_order_id AND buyer_id = auth.uid())
  OR seller_id = auth.uid()
  OR runner_id = auth.uid()
  OR is_warehouse_staff()
  OR is_admin()
);
CREATE POLICY "sub_orders_insert" ON sub_orders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM parent_orders WHERE id = parent_order_id AND buyer_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "sub_orders_update" ON sub_orders FOR UPDATE USING (
  seller_id = auth.uid()
  OR runner_id = auth.uid()
  OR is_warehouse_staff()
  OR is_admin()
);

CREATE POLICY "order_status_history_read" ON order_status_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sub_orders so
    JOIN parent_orders po ON po.id = so.parent_order_id
    WHERE so.id = order_status_history.sub_order_id
    AND (po.buyer_id = auth.uid() OR so.seller_id = auth.uid() OR so.runner_id = auth.uid())
  )
  OR is_warehouse_staff()
  OR is_admin()
);
CREATE POLICY "order_status_history_insert" ON order_status_history FOR INSERT WITH CHECK (is_warehouse_staff() OR is_admin() OR changed_by = auth.uid());

CREATE POLICY "runner_location_read" ON runner_location_log FOR SELECT USING (
  runner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM sub_orders so
    JOIN parent_orders po ON po.id = so.parent_order_id
    WHERE so.id = runner_location_log.sub_order_id AND po.buyer_id = auth.uid()
  )
  OR is_admin()
);
CREATE POLICY "runner_location_insert" ON runner_location_log FOR INSERT WITH CHECK (runner_id = auth.uid());

CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_buyer_write" ON reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "stories_public_read" ON seller_stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "stories_seller_write" ON seller_stories FOR INSERT WITH CHECK (seller_id = auth.uid());
CREATE POLICY "stories_seller_update" ON seller_stories FOR UPDATE USING (seller_id = auth.uid() OR is_admin());
CREATE POLICY "stories_seller_delete" ON seller_stories FOR DELETE USING (seller_id = auth.uid() OR is_admin());

CREATE POLICY "punch_cards_read" ON punch_cards FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR is_admin());
CREATE POLICY "punch_cards_write" ON punch_cards FOR ALL USING (is_admin() OR seller_id = auth.uid());

CREATE POLICY "referral_codes_read" ON referral_codes FOR SELECT USING (true);
CREATE POLICY "referral_codes_own" ON referral_codes FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "featured_listings_public_read" ON featured_listings FOR SELECT USING (is_active = true AND end_at > NOW());
CREATE POLICY "featured_listings_seller_write" ON featured_listings FOR INSERT WITH CHECK (seller_id = auth.uid());
CREATE POLICY "featured_listings_admin" ON featured_listings FOR ALL USING (is_admin());

CREATE POLICY "ambassadors_own" ON town_ambassadors FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "ambassadors_admin" ON town_ambassadors FOR ALL USING (is_admin());

CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (is_admin() OR is_warehouse_staff());

CREATE POLICY "whatsapp_log_admin" ON whatsapp_log FOR ALL USING (is_admin());

CREATE POLICY "logs_admin" ON logs FOR ALL USING (is_admin());
