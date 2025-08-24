-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert/update/delete profiles
CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create carrier data table with all columns
CREATE TABLE public.carrier_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dot_number TEXT,
  carrier_operation TEXT,
  phone TEXT,
  fax TEXT,
  cell_phone TEXT,
  company_officer_1 TEXT,
  company_officer_2 TEXT,
  business_org_desc TEXT,
  truck_units INTEGER,
  power_units INTEGER,
  total_intrastate_drivers INTEGER,
  total_drivers INTEGER,
  classdef TEXT,
  legal_name TEXT,
  dba_name TEXT,
  phy_street TEXT,
  phy_city TEXT,
  phy_country TEXT,
  phy_state TEXT,
  phy_zip TEXT,
  carrier_mailing_street TEXT,
  carrier_mailing_state TEXT,
  carrier_mailing_city TEXT,
  carrier_mailing_country TEXT,
  carrier_mailing_zip TEXT,
  carrier_mailing_cnty TEXT,
  email_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on carrier data
ALTER TABLE public.carrier_data ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view carrier data
CREATE POLICY "Authenticated users can view carrier data" ON public.carrier_data
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can manage carrier data
CREATE POLICY "Admins can manage carrier data" ON public.carrier_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );