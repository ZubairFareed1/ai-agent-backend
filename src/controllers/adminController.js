const pool = require('../config/db')
const {ExtractText} = require('../utils/ExtractText')


exports.fileUpload = async (req, res) => {
    try {
        const file = req.file; // Access the uploaded file
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }
        //extract text from pdf
        const text = await ExtractText(file);
        
        //insert text into database
        const query = 'INSERT INTO knowledge_base (admin_id, knowledge_base) VALUES ( $1,$2)';
        const values = [2,text];
        await pool.query(query, values);
        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.InsertWord = async (req, res) => {
    try {
        const { word } = req.body;
        const query = 'INSERT INTO keywords (admin_id, keyword_data) VALUES ($1, $2)';
        const values = [2,word];
        await pool.query(query, values);
        res.status(200).send({msg:'Word inserted successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


// get prevent words
exports.getPreventWords = async (req, res) => {
    try {
        const query = 'SELECT keyword_id as id ,keyword_data as word FROM keywords WHERE admin_id = $1 ORDER BY keyword_id DESC';
        const result = await pool.query(query,[2]);
        console.log(result.rows)
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


//delete prevent words
exports.deletePreventWords = async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id)
        const query = 'DELETE FROM keywords WHERE keyword_id = $1';
        await pool.query(query, [id]);
        res.status(200).send('Word deleted successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

//get Knowledge base
exports.getKnowledgeBase = async (req, res) => {
    try {
        const query = 'SELECT knowledge_base_id as id, knowledge_base as text FROM knowledge_base WHERE admin_id = $1 ORDER BY knowledge_base_id DESC';
        const result = await pool.query(query, [2]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// Delete Knowledge base
exports.deleteKnowledgeBase = async (req, res) => {
    try {
        const { id } = req.body;
        const query = 'DELETE FROM knowledge_base WHERE knowledge_base_id = $1';
        await pool.query(query, [id]);
        res.status(200).send('Knowledge base deleted successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}