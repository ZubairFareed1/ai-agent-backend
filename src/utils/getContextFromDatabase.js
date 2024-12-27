const pool = require('../config/db')

exports.getContextFromDatabase = async() => {
    const text = await pool.query('SELECT knowledge_base FROM knowledge_base WHERE admin_id = $1', [2]);
    return text;
}