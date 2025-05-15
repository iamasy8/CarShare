// my-app-backend/server.js
const express = require('express');
const mysql = require('mysql2'); // Import mysql2

console.log('MYSQL_ROOT_PASSWORD:', process.env.MYSQL_ROOT_PASSWORD); // Add this line

const app = express();
const port = 3008;

    // Get database host from environment variable, default to localhost for local development
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 3308; // Use 3307 for local connection to container's mapped port


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: dbHost, // Service name defined in docker-compose.yml for the database
  user: 'root', // Default MySQL root user
  password: process.env.MYSQL_ROOT_PASSWORD, // Get password from environment variable
  database: process.env.MYSQL_DATABASE,   // Get database name from environment variable
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database!');
  connection.release(); // Release the connection back to the pool
});

// Add a simple test route to fetch data (example)
app.get('/test-db', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
      return;
    }
    res.json(results[0]);
  });
});


app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Add more routes here to interact with the database

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
