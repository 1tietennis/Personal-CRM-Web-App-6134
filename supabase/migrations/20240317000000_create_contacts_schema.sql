-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts_93h2k1 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  location TEXT,
  category TEXT CHECK (category IN ('personal', 'professional', 'client', 'vendor')),
  notes TEXT,
  birthday DATE,
  work_anniversary DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  welcome_posted BOOLEAN DEFAULT false
);

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts_93h2k1(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts_93h2k1(email);
CREATE INDEX IF NOT EXISTS idx_contacts_category ON contacts_93h2k1(category);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts_93h2k1(company);
CREATE INDEX IF NOT EXISTS idx_email_logs_contact ON email_logs(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Add RLS policies
ALTER TABLE contacts_93h2k1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Contacts policies
CREATE POLICY "Allow select access to authenticated users" ON contacts_93h2k1
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert access to authenticated users" ON contacts_93h2k1
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update access to authenticated users" ON contacts_93h2k1
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow delete access to authenticated users" ON contacts_93h2k1
  FOR DELETE TO authenticated USING (true);

-- Email logs policies
CREATE POLICY "Allow select access to authenticated users" ON email_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert access to authenticated users" ON email_logs
  FOR INSERT TO authenticated WITH CHECK (true);