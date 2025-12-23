import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase with service role key to bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface CSVRow {
  Name: string;
  Email: string;
  'Financial Status': string;
  'Paid at': string;
  'Fulfillment Status': string;
  'Fulfilled at': string;
  Currency: string;
  Subtotal: string;
  Shipping: string;
  Taxes: string;
  Total: string;
  'Created at': string;
  'Lineitem quantity': string;
  'Lineitem name': string;
  'Lineitem price': string;
  'Lineitem sku': string;
  'Lineitem fulfillment status': string;
  'Billing Name': string;
  'Billing Street': string;
  'Billing Address1': string;
  'Billing Address2': string;
  'Billing City': string;
  'Billing Zip': string;
  'Billing Province': string;
  'Billing Country': string;
  'Billing Phone': string;
  'Shipping Name': string;
  'Shipping Street': string;
  'Shipping Address1': string;
  'Shipping Address2': string;
  'Shipping City': string;
  'Shipping Zip': string;
  'Shipping Province': string;
  'Shipping Country': string;
  'Shipping Phone': string;
  Id: string;
  Tags: string;
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row as CSVRow);
  }
  
  return rows;
}

function groupOrdersByOrderNumber(rows: CSVRow[]): Map<string, CSVRow[]> {
  const orderMap = new Map<string, CSVRow[]>();
  
  for (const row of rows) {
    const orderNumber = row.Name;
    if (!orderNumber) continue;
    
    if (!orderMap.has(orderNumber)) {
      orderMap.set(orderNumber, []);
    }
    orderMap.get(orderNumber)!.push(row);
  }
  
  return orderMap;
}

function transformOrder(orderRows: CSVRow[]) {
  const firstRow = orderRows[0];
  
  // Extract Shopify order ID from the Id field
  const shopifyOrderId = firstRow.Id;
  const orderNumber = firstRow.Name.replace('#', '');
  
  // Get customer info
  const customerEmail = firstRow.Email || null;
  const customerName = firstRow['Billing Name'] || firstRow['Shipping Name'] || 'Guest';
  const customerPhone = firstRow['Billing Phone'] || firstRow['Shipping Phone'] || null;
  
  // Parse line items
  const lineItems = orderRows
    .filter(row => row['Lineitem name']) // Only rows with line items
    .map(row => ({
      id: Math.random().toString(36).substring(7), // Generate a temporary ID
      title: row['Lineitem name'],
      quantity: parseInt(row['Lineitem quantity']) || 1,
      price: row['Lineitem price'],
      variant_id: null,
      variant_title: null,
      product_id: null,
      image_url: null,
    }));
  
  // Parse addresses
  const shippingAddress = firstRow['Shipping Name'] ? {
    firstName: firstRow['Shipping Name'].split(' ')[0] || '',
    lastName: firstRow['Shipping Name'].split(' ').slice(1).join(' ') || '',
    address1: firstRow['Shipping Address1'],
    address2: firstRow['Shipping Address2'],
    city: firstRow['Shipping City'],
    province: firstRow['Shipping Province'],
    country: firstRow['Shipping Country'],
    zip: firstRow['Shipping Zip'],
    phone: firstRow['Shipping Phone'],
  } : null;
  
  const billingAddress = firstRow['Billing Name'] ? {
    firstName: firstRow['Billing Name'].split(' ')[0] || '',
    lastName: firstRow['Billing Name'].split(' ').slice(1).join(' ') || '',
    address1: firstRow['Billing Address1'],
    address2: firstRow['Billing Address2'],
    city: firstRow['Billing City'],
    province: firstRow['Billing Province'],
    country: firstRow['Billing Country'],
    zip: firstRow['Billing Zip'],
    phone: firstRow['Billing Phone'],
  } : null;
  
  // Map Shopify status to lowercase
  const financialStatus = firstRow['Financial Status']?.toLowerCase() || 'pending';
  const fulfillmentStatus = firstRow['Fulfillment Status']?.toLowerCase() || null;
  
  // Parse dates
  const processedAt = firstRow['Paid at'] || firstRow['Created at'];
  
  return {
    shopify_order_id: shopifyOrderId,
    order_number: orderNumber,
    customer_email: customerEmail,
    customer_name: customerName,
    customer_phone: customerPhone,
    total_price: parseFloat(firstRow.Total) || 0,
    currency: firstRow.Currency || 'INR',
    financial_status: financialStatus,
    fulfillment_status: fulfillmentStatus === 'unfulfilled' ? null : fulfillmentStatus,
    line_items: lineItems,
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    order_status_url: null,
    processed_at: processedAt,
  };
}

async function importOrders() {
  console.log('🚀 Starting order import from CSV...\n');

  try {
    // Read CSV file
    const csvPath = 'c:\\Users\\ADMIN\\Downloads\\orders_export_1.csv';
    console.log('📂 Reading CSV from:', csvPath);
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    console.log('✅ CSV file loaded\n');
    
    // Parse CSV
    console.log('📊 Parsing CSV...');
    const rows = parseCSV(csvContent);
    console.log(`✅ Parsed ${rows.length} rows\n`);
    
    // Group by order number
    const orderMap = groupOrdersByOrderNumber(rows);
    console.log(`📦 Found ${orderMap.size} unique orders\n`);
    
    // Transform and import orders
    console.log('💾 Importing orders to Supabase...\n');
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (const [orderNumber, orderRows] of orderMap) {
      const transformedOrder = transformOrder(orderRows);
      
      // Skip orders without email (unless you want to keep them)
      if (!transformedOrder.customer_email) {
        console.log(`⏭️  Skipping order ${orderNumber} (no email)`);
        skippedCount++;
        continue;
      }
      
      const { error } = await supabase
        .from('orders')
        .upsert(transformedOrder, {
          onConflict: 'shopify_order_id',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(`❌ Error importing order ${orderNumber}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Imported order ${orderNumber} (${transformedOrder.customer_email})`);
        successCount++;
      }
    }

    console.log('\n🎉 Import complete!');
    console.log(`✅ Successfully imported: ${successCount} orders`);
    if (skippedCount > 0) {
      console.log(`⏭️  Skipped (no email): ${skippedCount} orders`);
    }
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} orders`);
    }
  } catch (error: any) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run the import
importOrders();
