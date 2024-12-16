const express = require('express');
const getAiResponse = require('../src/ai_model/aiModel')
const app = express();
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes')
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use('/api/users', userRoutes);
app.use('/api/admin',adminRoutes)
async function get(){
    const result = await getAiResponse;
    console.log(result)
}
get()


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});