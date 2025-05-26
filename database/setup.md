# Database Setup Guide

## Manual Setup in Supabase Dashboard

Since we don't have the Supabase CLI configured, you can manually create the required tables by running the SQL commands in the Supabase Dashboard SQL Editor.

### Steps:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `schema.sql` 
4. Click "Run" to execute the commands

### Tables Created:

- **resumes**: Stores user resume data as JSON
- **portfolios**: Stores portfolio URLs and links to resumes

### Row Level Security:

The schema includes RLS policies that ensure users can only access their own data.

### Next Steps:

After running the schema, your Editor Sprint functionality will be ready to use! 