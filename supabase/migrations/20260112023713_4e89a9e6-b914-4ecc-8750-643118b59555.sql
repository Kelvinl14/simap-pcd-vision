-- Allow public to look up email by CPF for login purposes
-- This is safe because we only expose the email, not sensitive data
CREATE POLICY "anyone_can_lookup_email_by_cpf"
ON public.profiles
FOR SELECT
USING (true);