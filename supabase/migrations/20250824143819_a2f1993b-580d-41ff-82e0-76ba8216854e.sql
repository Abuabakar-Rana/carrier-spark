-- Create RPC function to get user email by ID for login
CREATE OR REPLACE FUNCTION public.get_user_email_by_id(user_id UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id;
  
  RETURN user_email;
END;
$$;