-- SQL Schema for Remesa Simulator
-- Database: PostgreSQL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', 
    -- Status flow: PENDING -> RECEIVED -> PROCESSING -> COMPLETED (or FAILED)
    
    deposit_address VARCHAR(56) NOT NULL, -- Stellar Public Key (G...) for deposit
    deposit_secret VARCHAR(56) NOT NULL,  -- Stellar Secret Key (S...) for the temporary deposit account
    
    stellar_hash VARCHAR(64),             -- Transaction hash from Stellar Horizon
    amount_usd DECIMAL(18, 2) NOT NULL,    -- Amount requested in USD
    amount_xlm DECIMAL(18, 7) NOT NULL,    -- Calculated equivalent in XLM
    
    airtm_voucher_id VARCHAR(100),        -- Reference ID from Airtm Sandbox
    airtm_status VARCHAR(50),             -- Status of the Airtm operation
    
    user_email VARCHAR(255),              -- Optional: User email for the simulation
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
