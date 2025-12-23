-- Create orders table to store Shopify orders synced via webhooks
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_order_id TEXT UNIQUE NOT NULL,
  order_number TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  financial_status TEXT,
  fulfillment_status TEXT,
  line_items JSONB NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  order_status_url TEXT,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on customer_email for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);

-- Create index on shopify_order_id for webhook updates
CREATE INDEX IF NOT EXISTS idx_orders_shopify_id ON public.orders(shopify_order_id);

-- Create index on processed_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_processed_at ON public.orders(processed_at DESC);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders (matched by email)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT
  USING (
    customer_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Policy: Service role can insert/update orders (for webhooks)
CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
