-- Migration: Add updated_at column to tables that lack it
-- Required for timestamp-based sync conflict resolution

-- users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;

-- transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();
UPDATE transactions SET updated_at = "date" WHERE updated_at IS NULL;

-- accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();
UPDATE accounts SET updated_at = created_at WHERE updated_at IS NULL;

-- account_members table
ALTER TABLE account_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();
UPDATE account_members SET updated_at = joined_at WHERE updated_at IS NULL;
