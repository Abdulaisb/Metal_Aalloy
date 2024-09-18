const express = require('express');
const app = express();
const port = 3000; // You can change the port if needed
const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'alloy_info',
    password: 'pass',
    port: 5432, // Default PostgreSQL port
});

module.exports = pool;
// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on ${port}`);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Test Query
app.get('/testDB', async (req, res) => {
  const result = await pool.query('SELECT * FROM alloy;');
  res.json(result.rows);
});

//Original User input
app.post('/userRequest', async (req, res) => {
  //if alloy exists and has request read database
  //else run gpt function to fill database, then return data needed
});

//function to return alloy id if in database

//function that returns list of properties and values

//function that returns list of stress and strain



//GPT to get alloy properties and place in database

//GPT to get alloy stress strain and place in database

//(Extra) function that returns webscraping

//(Extra) function that interacts with user to get good input