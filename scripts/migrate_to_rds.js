const { Client } = require('pg');

/**
 * Migration Script: Aurora DSQL -> Aurora RDS (PostgreSQL)
 * 
 * Usage:
 * export SOURCE_DB_URL="postgres://user:pass@host:port/dbname"
 * export DEST_DB_URL="postgres://user:pass@host:port/dbname"
 * node scripts/migrate_to_rds.js
 */

async function migrate() {
  const sourceClient = new Client({ connectionString: process.env.SOURCE_DB_URL, ssl: { rejectUnauthorized: false }  });
  const destClient = new Client({ connectionString: process.env.DEST_DB_URL, ssl: { rejectUnauthorized: false }  });

  try {
    console.log('Connecting to databases...');
    await sourceClient.connect();
    await destClient.connect();
    console.log('Connected.');

    // 1. Migrate Users
    console.log('Migrating Users...');
    const users = await sourceClient.query('SELECT * FROM users');
    for (const row of users.rows) {
      await destClient.query(
        `INSERT INTO users (user_id, name, email, avatar_url, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO NOTHING`,
        [row.user_id, row.name, row.email, row.avatar_url, row.created_at]
      );
    }

    // 2. Migrate Accounts
    console.log('Migrating Accounts...');
    const accounts = await sourceClient.query('SELECT * FROM accounts');
    for (const row of accounts.rows) {
      // Note: We ignore the 'members' JSON column here as it's redundant
      await destClient.query(
        `INSERT INTO accounts (account_id, name, owner_id, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_id) DO NOTHING`,
        [row.account_id, row.name, row.owner_id, row.created_at]
      );
    }

    // 3. Migrate Account Members
    console.log('Migrating Account Members...');
    const members = await sourceClient.query('SELECT * FROM account_members');
    for (const row of members.rows) {
      await destClient.query(
        `INSERT INTO account_members (account_id, user_id, role, joined_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_id, user_id) DO NOTHING`,
        [row.account_id, row.user_id, row.role, row.joined_at]
      );
    }
    
    // Check for missing members from accounts.members JSON
    // (Optional: Implement if DSQL data was inconsistent)
    
    // 4. Migrate Budgets
    console.log('Migrating Budgets...');
    const budgets = await sourceClient.query('SELECT * FROM budgets');
    for (const row of budgets.rows) {
      let monthlyItems = '[]';
      try {
        if (typeof row.monthly_items === 'string') {
            monthlyItems = row.monthly_items; // It's already JSON string
            // Validate it
            JSON.parse(monthlyItems);
        } else if (row.monthly_items) {
            monthlyItems = JSON.stringify(row.monthly_items);
        }
      } catch (e) {
        console.warn(`Invalid JSON in budget ${row.budget_id}, resetting to []`);
        monthlyItems = '[]';
      }

      await destClient.query(
        `INSERT INTO budgets (budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
         ON CONFLICT (budget_id) DO NOTHING`,
        [row.budget_id, row.account_id, row.annual_budget, row.monthly_budget, monthlyItems, row.created_at, row.updated_at]
      );
    }

    // 5. Migrate Transactions
    console.log('Migrating Transactions...');
    const transactions = await sourceClient.query('SELECT * FROM transactions');
    for (const row of transactions.rows) {
      // Convert transaction_id to string if needed, currently VARCHAR
      await destClient.query(
        `INSERT INTO transactions (transaction_id, account_id, recorded_by_user_id, amount, type, category, description, date, necessity)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (transaction_id) DO NOTHING`,
        [row.transaction_id.toString(), row.account_id, row.recorded_by_user_id, row.amount, row.type, row.category, row.description, row.date, row.necessity]
      );
    }

    // 6. Migrate Favorite Categories
    console.log('Migrating Favorite Categories...');
    const favCats = await sourceClient.query('SELECT * FROM favorite_categories');
    for (const row of favCats.rows) {
        // Handle column name mismatch if source had 'investments' and dest has 'investment'
        // Assuming source has 'investments' based on schema.txt, but code used 'investment'. 
        // We try to grab either.
        const investment = row.investment || row.investments || '';

      await destClient.query(
        `INSERT INTO favorite_categories (
            category_id, owner_id, food, clothing, housing, transportation, 
            education, entertainment, daily, medical, investment, other, 
            salary, bonus, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (category_id) DO NOTHING`,
        [
            row.category_id, row.owner_id, row.food, row.clothing, row.housing, row.transportation,
            row.education, row.entertainment, row.daily, row.medical, investment, row.other,
            row.salary, row.bonus, row.created_at, row.updated_at
        ]
      );
    }

    console.log('Migration Complete!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await sourceClient.end();
    await destClient.end();
  }
}

migrate();
