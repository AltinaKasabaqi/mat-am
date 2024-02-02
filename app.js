const express = require('express');
const path = require('path');
const dbconn = require('./dbconn');
const app = express();
const port = 3000;

// Configure the PostgreSQL connection pool


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'assets')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'views', 'index.html'));
});

// Route to handle form submission
// Route to handle form submission
app.post('/', async (req, res) => {
    try {
      const { name, email, phone, numpeople, date, time, message } = req.body;
  
      // SQL query to insert data into the database
      const query = `
        INSERT INTO rezervimi (klienti, email, nr_tel, nr_personave, data, ora, mesazhi)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
  
      // Execute the query with user input values
      dbconn.query(query, [name, email, phone, numpeople, date, time, message], (error, result) => {
        if (error) {
          console.error('Error creating reservation:', error);
          res.status(500).json({ error: 'An error occurred while processing your request' });
        } else {
            console.log("Success");
            res.redirect('/');
        }
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

