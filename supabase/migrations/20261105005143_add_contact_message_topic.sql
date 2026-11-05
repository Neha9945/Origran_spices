/*
# Add topic to contact messages

1. Modified Tables
- `contact_messages`: new `topic` column (general, retail or wholesale) so wholesale enquiries can be told apart from everyday questions.

2. Security
- No change to access rules. Visitors can still only submit messages; they cannot read them.

3. Important Notes
- Existing rows (if any) default to 'general'.
*/

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS topic text NOT NULL DEFAULT 'general'
  CHECK (topic IN ('general', 'retail', 'wholesale'));
