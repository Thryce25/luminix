-- Add phone_number column to profiles table (MANDATORY)
-- Run this in your Supabase SQL Editor

-- Step 1: Add the column if it doesn't exist (nullable first)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Step 2: Update any existing user metadata to profiles (optional)
-- This will populate phone numbers from auth.users metadata if they exist
UPDATE profiles p
SET phone_number = (
  SELECT (raw_user_meta_data->>'phone_number')::text
  FROM auth.users u
  WHERE u.id = p.id
  AND u.raw_user_meta_data->>'phone_number' IS NOT NULL
)
WHERE p.phone_number IS NULL;

-- Step 3: Set default value for any remaining NULL phone numbers
-- (Use a placeholder like 'NOT_PROVIDED' for existing users without phone)
UPDATE profiles
SET phone_number = 'NOT_PROVIDED'
WHERE phone_number IS NULL OR phone_number = '';

-- Step 4: Make phone_number mandatory (NOT NULL constraint)
ALTER TABLE profiles
ALTER COLUMN phone_number SET NOT NULL;

-- Step 5: Add a check constraint to ensure phone format (10 digits)
ALTER TABLE profiles
ADD CONSTRAINT phone_number_format 
CHECK (phone_number = 'NOT_PROVIDED' OR phone_number ~ '^[0-9]{10}$');
