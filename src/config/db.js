const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ai-agent',
  password: 'admin@123',
  port: 5432,
})
module.exports = pool