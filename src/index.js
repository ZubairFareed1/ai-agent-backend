const express = require('express');
const app = express();
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use('/api/users', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});