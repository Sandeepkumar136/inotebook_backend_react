const express = require('express');
const connectToMongo=require('./db');
const cors = require('cors');
require('dotenv').config();


connectToMongo();

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors())

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.get('/health', (res) => {
  res.send('Server is up and running');
});



app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})