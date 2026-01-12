-- Create enum types for role and scope
CREATE TYPE public.app_role AS ENUM ('DEV', 'ADM', 'CAD', 'CON', 'CNT');
CREATE TYPE public.app_scope AS ENUM ('SUPER', 'FULL', 'BASIC', 'READ', 'FIN');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  cpf varchar(11) NOT NULL UNIQUE,
  role public.app_role NOT NULL,
  scope public.app_scope NOT NULL,
  first_access boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Create activation_codes table
CREATE TABLE public.activation_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash text NOT NULL,
  role public.app_role NOT NULL,
  scope public.app_scope NOT NULL,
  max_uses int DEFAULT 1,
  used_count int DEFAULT 0,
  expires_at timestamp,
  revoked boolean DEFAULT false,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read their own profile
CREATE POLICY "user_can_read_own_profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- RLS policy: users can update their own profile (for first_access flag)
CREATE POLICY "user_can_update_own_profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to check if user is DEV or ADM
CREATE OR REPLACE FUNCTION public.is_admin_or_dev(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role IN ('DEV', 'ADM')
  )
$$;

-- RLS policy: DEV and ADM can manage activation codes
CREATE POLICY "dev_admin_manage_codes"
ON public.activation_codes
FOR ALL
USING (public.is_admin_or_dev(auth.uid()));

-- RLS policy: allow reading activation codes for activation process (public read for code validation)
CREATE POLICY "anyone_can_read_valid_codes"
ON public.activation_codes
FOR SELECT
USING (
  revoked = false 
  AND used_count < max_uses 
  AND (expires_at IS NULL OR expires_at > now())
);

-- Insert default DEV activation code
INSERT INTO public.activation_codes (
  code_hash,
  role,
  scope,
  max_uses,
  expires_at
) VALUES (
  'SIMAP-DEV-SUPER-ROOT00-X0',
  'DEV',
  'SUPER',
  5,
  null
);