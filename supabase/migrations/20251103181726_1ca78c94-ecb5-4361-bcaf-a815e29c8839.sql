-- Create inventory items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  reorder_level INTEGER NOT NULL DEFAULT 10,
  cost_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  supplier TEXT,
  barcode TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory movements table for tracking
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'waste')),
  quantity INTEGER NOT NULL,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create batch tracking table
CREATE TABLE public.inventory_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  batch_number TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  expiry_date DATE,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales analytics table
CREATE TABLE public.sales_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_items_sold INTEGER NOT NULL DEFAULT 0,
  average_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable Row Level Security
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (public for now, will add auth later)
CREATE POLICY "Enable read access for all users" ON public.inventory_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.inventory_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.inventory_items FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.inventory_movements FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.inventory_movements FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.inventory_batches FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.inventory_batches FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.inventory_batches FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.inventory_batches FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.sales_analytics FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.sales_analytics FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_items_quantity ON public.inventory_items(quantity);
CREATE INDEX idx_inventory_movements_item_id ON public.inventory_movements(inventory_item_id);
CREATE INDEX idx_inventory_batches_expiry ON public.inventory_batches(expiry_date);
CREATE INDEX idx_sales_analytics_date ON public.sales_analytics(date);