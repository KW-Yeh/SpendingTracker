-- Users Table
-- Added unique index on email for faster lookups during login/auth
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY, -- Kept as BIGINT to match existing ID generation (Date.now())
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Accounts Table
-- Removed 'members' JSON column as it is redundant. Use account_members table.
CREATE TABLE accounts (
    account_id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id BIGINT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_owner_id ON accounts(owner_id);

-- Account Members Table
-- Normalized relationship between users and accounts
CREATE TABLE account_members (
    account_id BIGINT REFERENCES accounts(account_id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    role VARCHAR(50) CHECK (role IN ('Owner', 'Editor', 'Viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id, user_id)
);

CREATE INDEX idx_account_members_user_id ON account_members(user_id);

-- Budgets Table
-- Changed monthly_items to JSONB for better performance and potential indexing
CREATE TABLE budgets (
    budget_id BIGINT PRIMARY KEY,
    account_id BIGINT REFERENCES accounts(account_id) ON DELETE CASCADE,
    annual_budget NUMERIC(12, 2) DEFAULT 0,
    monthly_budget NUMERIC(12, 2) DEFAULT 0,
    monthly_items JSONB DEFAULT '[]'::jsonb, -- Storing monthly breakdown as structured JSONB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_account_id ON budgets(account_id);

-- Transactions Table
-- Changed transaction_id to VARCHAR(100) to support various ID formats (UUID/Strings)
CREATE TABLE transactions (
    transaction_id VARCHAR(100) PRIMARY KEY,
    account_id BIGINT REFERENCES accounts(account_id) ON DELETE CASCADE,
    recorded_by_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'expense', 'income'
    category VARCHAR(100),
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    necessity VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_account_date ON transactions(account_id, date DESC);
CREATE INDEX idx_transactions_user_id ON transactions(recorded_by_user_id);
CREATE INDEX idx_transactions_category ON transactions(category);

-- Favorite Categories Table
-- Kept as flat columns for now to match application logic, but added constraints/indexes if needed.
-- Consider migrating to a single JSONB column 'preferences' in the future if schema flexibility is needed.
CREATE TABLE favorite_categories (
    category_id BIGINT PRIMARY KEY,
    owner_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE UNIQUE, -- One preference set per user
    food TEXT DEFAULT '',
    clothing TEXT DEFAULT '',
    housing TEXT DEFAULT '',
    transportation TEXT DEFAULT '',
    education TEXT DEFAULT '',
    entertainment TEXT DEFAULT '',
    daily TEXT DEFAULT '',
    medical TEXT DEFAULT '',
    investment TEXT DEFAULT '', -- Updated to match code usage (was investments in schema.txt)
    other TEXT DEFAULT '',
    salary TEXT DEFAULT '',
    bonus TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
