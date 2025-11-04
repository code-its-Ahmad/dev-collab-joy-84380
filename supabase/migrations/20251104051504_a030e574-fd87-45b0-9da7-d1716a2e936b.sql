-- Fix RLS policies for customers table - restrict to authenticated users only
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.customers;

CREATE POLICY "Authenticated users can view customers"
ON public.customers FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert customers"
ON public.customers FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update customers"
ON public.customers FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete customers"
ON public.customers FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- Fix RLS policies for inventory_items table - restrict to authenticated users only
DROP POLICY IF EXISTS "Enable read access for all users" ON public.inventory_items;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.inventory_items;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.inventory_items;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.inventory_items;

CREATE POLICY "Authenticated users can view inventory"
ON public.inventory_items FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert inventory"
ON public.inventory_items FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update inventory"
ON public.inventory_items FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete inventory"
ON public.inventory_items FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- Fix RLS policies for inventory_batches table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.inventory_batches;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.inventory_batches;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.inventory_batches;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.inventory_batches;

CREATE POLICY "Authenticated users can view batches"
ON public.inventory_batches FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert batches"
ON public.inventory_batches FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update batches"
ON public.inventory_batches FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete batches"
ON public.inventory_batches FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- Fix RLS policies for inventory_movements table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.inventory_movements;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.inventory_movements;

CREATE POLICY "Authenticated users can view movements"
ON public.inventory_movements FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert movements"
ON public.inventory_movements FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Fix RLS policies for sales_analytics table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sales_analytics;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.sales_analytics;

CREATE POLICY "Authenticated users can view analytics"
ON public.sales_analytics FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert analytics"
ON public.sales_analytics FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');