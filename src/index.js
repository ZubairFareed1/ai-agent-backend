const express = require('express');
const getAiResponse = require('../src/ai_model/aiModel')
const app = express();
const path = require('path')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes')
app.use('/src/profile_picture', express.static(path.join(__dirname, 'profile_picture')))
app.use(express.json());
app.use(cors({
    // origin: 'http://localhost:5173'
    origin: '*'
}))

app.use('/api/users', userRoutes);
app.use('/api/admin',adminRoutes)



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});