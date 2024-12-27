const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'mysecretkey123';
const getAiResponse = require('../ai_model/aiModel')

// create a new user
exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if(existingUser.rows.length > 0 ) {
      return res.status(400).json({"msg":"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};



// login user
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credentials");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({"msg":"Email or password are incorrect"});
    }
    
      const token = jwt.sign({ email: user.rows[0].email }, SECRET_KEY,{expiresIn:'1 hour'});
      const conversation = await pool.query(
        "SELECT * FROM conversation WHERE user_id = $1",
        [user.rows[0].user_id]
      );
      const dashboardData = {
        token: token,
        user: user.rows[0],
      }
      if(conversation.rows.length > 0){
        await pool.query(
          "INSERT INTO login_history (user_id, timestamp) VALUES ($1, $2);",
          [user.rows[0].user_id, new Date()]
        );
        dashboardData.conversation = conversation.rows[0];
      }
      res.status(200).json({dashboardData});

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
    
};






    // get All users
    exports.getUsers = async (req, res) => {
      try{
        const users = await pool.query("SELECT * FROM users;");
        res.json(users.rows);
      }catch(err){
        console.error(err.message);
      }
    };


    // New Conversation
    exports.newConversation = async (req, res) => {
      try{
        const {user_id, query_text} = req.body;
        
        const new_conversation = await pool.query('INSERT INTO conversation (user_id) VALUES ($1) RETURNING *',[user_id])

        const newConversation_id = new_conversation.rows[0].conversation_id;

        const newQuery = await pool.query('INSERT INTO query (conversation_id, query_data) VALUES ($1, $2) RETURNING *',[newConversation_id, query_text])

        const aiResponse = await getAiResponse(query_text)

        const newAiResponse = await pool.query('INSERT INTO ai_response (conversation_id, conversation_data) VALUES ($1, $2) RETURNING *',[newConversation_id, aiResponse])

        res.status(201).json({
          conversation: new_conversation.rows[0],
          query: newQuery.rows[0],
          ai_response: newAiResponse.rows[0]
        })

      }catch(err){
        console.error(err.message)
      }
    }

    
    exports.continueConversation = async (req, res) => {
         try{
        const {user_id, conversation_id, query_text} = req.body;
        const conversation = await pool.query('SELECT * FROM conversation WHERE conversation_id = $1', [conversation_id])
        if(conversation.rows.length === 0 ){
          return res.status(404).json({message: 'Conversation not found'});
        }
        
        const aiResponse = await getAiResponse(query_text);
        if(!!aiResponse.answer){
          return res.status(404).json({message: 'Something went wrong'});
        }
        const queryTimestamp = new Date(); 
        const query = await pool.query('INSERT INTO query  (conversation_id, query_data, timestamp) VALUES ($1, $2, $3) RETURNING *', [conversation_id, query_text, queryTimestamp]);
        
        // const aiResponse = JSON.stringify(new Date())
        const responseTimestamp = new Date();

        const response = await pool.query('INSERT INTO ai_response (conversation_id, conversation_data, timestamp) VALUES ($1, $2, $3) RETURNING *', [conversation_id, aiResponse, responseTimestamp])

        const finalData = {
          conversation: conversation.rows,
          query: query.rows[0],
          response: response.rows[0]
        }
        // console.log(finalData)
        
        res.status(201).json( finalData )
        

      }catch(err){
        console.error(err.message)
      }
      
    }
    
// get all conversation by title and first query and response
exports.getAllConversation = async (req, res) => {
  const { userId } = req.params;

  const query = `
  SELECT 
  c.conversation_id,
  c.user_id,
  c.started_at,
  c.ended_at,
  q.query_data AS first_query,
  r.conversation_data AS first_response
  FROM 
  conversation c
  JOIN 
  query q ON c.conversation_id = q.conversation_id
  JOIN 
  ai_response r ON c.conversation_id = r.conversation_id
  WHERE 
  q.timestamp = (
              SELECT MIN(q2.timestamp)
              FROM query q2
              WHERE q2.conversation_id = c.conversation_id
          )
          AND r.timestamp = (
            SELECT MIN(r2.timestamp)
            FROM ai_response r2
            WHERE r2.conversation_id = c.conversation_id
            )
            AND c.user_id = $1
            ORDER BY 
            c.started_at DESC;
            
  `;

  try {
      const result = await pool.query(query, [userId]);
      res.status(200).json({ conversations: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching conversation history' });
  }
}


// Get conversation by id
exports.getConversationById = async (req, res) => {
  const { conversation_id } = req.params;
  // console.log(conversation_id)
  try{
    
    const conversation = await pool.query('SELECT conversation_id FROM conversation WHERE conversation_id = $1',[conversation_id]);
    if(conversation.rows.length === 0){
      return res.status(404).json({message: 'conversation not found'})
    }

    const query = await pool.query('SELECT query_id, query_data, timestamp FROM query WHERE conversation_id = $1 ORDER BY timestamp', [conversation_id]);

    const response = await pool.query('SELECT response_id, conversation_data, timestamp FROM ai_response WHERE conversation_id = $1 ORDER BY timestamp', [conversation_id])

    res.status(200).json({
      conversation:conversation.rows[0],
      query: query.rows,
      response: response.rows
    })

  }catch(error){
    console.error(error.message)

  }
}

exports.getLoginHistory = async (req, res) => {
  const { userId } = req.body;
  // const userId = 14;
  // console.log({userId:userId})

  try {
    const loginHistory = await pool.query('SELECT * FROM login_history WHERE user_id = $1 ORDER BY timestamp DESC;', [userId]);
    // console.log({loginHistory:loginHistory.rows})
    res.status(200).json({ loginHistory: loginHistory.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching login history' });
  }
}


// get user Info
exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user information' });
  }
}
