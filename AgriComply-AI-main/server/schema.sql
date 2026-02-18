CREATE DATABASE IF NOT EXISTS agricomply_db;
USE agricomply_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET @users_role_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'agricomply_db'
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role'
);
SET @users_role_sql := IF(
  @users_role_exists = 0,
  'ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT ''Farmer''',
  'SELECT 1'
);
PREPARE users_stmt FROM @users_role_sql;
EXECUTE users_stmt;
DEALLOCATE PREPARE users_stmt;

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    tag VARCHAR(50),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS compliance_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(100),
    required_doc_tag VARCHAR(50),
    applicable_role VARCHAR(50) DEFAULT 'ALL',
    penalty_amount DECIMAL(10,2),
    due_date DATE
);

SET @rules_role_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'agricomply_db'
    AND TABLE_NAME = 'compliance_rules'
    AND COLUMN_NAME = 'applicable_role'
);
SET @rules_role_sql := IF(
  @rules_role_exists = 0,
  'ALTER TABLE compliance_rules ADD COLUMN applicable_role VARCHAR(50) DEFAULT ''ALL''',
  'SELECT 1'
);
PREPARE rules_stmt FROM @rules_role_sql;
EXECUTE rules_stmt;
DEALLOCATE PREPARE rules_stmt;

CREATE TABLE IF NOT EXISTS schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(100),
    description TEXT,
    required_docs_json JSON
);

INSERT INTO compliance_rules (rule_name, required_doc_tag, applicable_role, due_date)
SELECT 'Income Tax Filing', 'ITR-V', 'ALL', '2025-07-31'
WHERE NOT EXISTS (SELECT 1 FROM compliance_rules WHERE rule_name = 'Income Tax Filing');

INSERT INTO compliance_rules (rule_name, required_doc_tag, applicable_role, due_date)
SELECT 'GST October Return', 'GSTR-3B', 'FPO', '2025-11-20'
WHERE NOT EXISTS (SELECT 1 FROM compliance_rules WHERE rule_name = 'GST October Return');

INSERT INTO compliance_rules (rule_name, required_doc_tag, applicable_role, due_date)
SELECT 'Land Ownership Proof', 'LandRecord', 'Farmer', '2025-12-31'
WHERE NOT EXISTS (SELECT 1 FROM compliance_rules WHERE rule_name = 'Land Ownership Proof');

INSERT INTO schemes (scheme_name, description, required_docs_json)
SELECT
  'Kisan Credit Card',
  'Working capital support for crop production.',
  '["PAN", "LandRecord", "Aadhaar"]'
WHERE NOT EXISTS (SELECT 1 FROM schemes WHERE scheme_name = 'Kisan Credit Card');

INSERT INTO schemes (scheme_name, description, required_docs_json)
SELECT
  'Tractor Loan',
  'Term loan for farm machinery purchase.',
  '["Aadhaar", "Quotation", "LandRecord", "BankStatement"]'
WHERE NOT EXISTS (SELECT 1 FROM schemes WHERE scheme_name = 'Tractor Loan');
