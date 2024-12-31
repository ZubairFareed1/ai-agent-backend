// get prevents from db to check query

const pool = require('../config/db');

exports.getPreventWords = async () => {
    try {
        const query = 'SELECT keyword_data FROM keywords';
        const result = await pool.query(query);
        const preventWords = result.rows.map(row => row.keyword_data.toLowerCase());
        return preventWords;
    } catch (error) {
        console.error('Error fetching prevent words:', error);
        throw error;
    }
};

