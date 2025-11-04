-- Drop existing SELECT policy for orders
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.orders;

-- Create new role-based SELECT policies for orders
-- Owners can see all order details including customer contact information
CREATE POLICY "Owners can view all order details"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'owner'::app_role
  )
);

-- Staff can only see orders they created (with full details)
CREATE POLICY "Staff can view their own orders with customer details"
ON public.orders
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid()
);

-- Create a function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = 'owner'::app_role
  )
$$;

-- Comment explaining the security model
COMMENT ON POLICY "Owners can view all order details" ON public.orders IS 
'Owners have full access to all customer contact information for business operations and analytics';

COMMENT ON POLICY "Staff can view their own orders with customer details" ON public.orders IS 
'Staff members can only view customer contact details for orders they personally created, protecting customer privacy';
