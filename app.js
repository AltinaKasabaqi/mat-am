const express = require('express');
const session = require('express-session'); // Importimi i modulit express-session
const path = require('path');
const dbconn = require('./dbconn');
const app = express();
const port = 3000;

// Configure the PostgreSQL connection pool

// const store = new MongoDBStore({
//   uri: 'mongodb://localhost:27017/sessions', // Lokacioni i MongoDB
//   collection: 'mySessions'
// });

app.use(session({
  secret: 'sekreti-per-sesionin',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


function verifySession(req, res, next) {
  if (req.session && req.session.loggedin) {
      // Nëse sesioni ekziston dhe përdoruesi është i loguar, vazhdo me rruajtë e tjera
      next();
  } else {
      // Nëse nuk ka sesion ose përdoruesi nuk është i loguar, ridrejtohu në një faqe tjetër ose kthe një mesazh të gabimit
      res.redirect('/admin'); // Kthehu në një faqe logimi për shembull
  }
}

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'assets')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'views', 'admin.html'));
});


app.get('/administration', verifySession, (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'views', 'administration.html'));
});



  app.get('/rezervime', verifySession, (req, res) => {
    const query = 'SELECT * FROM rezervimi'; // SQL query për të marrë të gjitha rezervimet
    dbconn.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving reservations:', error);
            res.status(500).json({ error: 'An error occurred while processing your request' });
        } else {
            res.json(results); 
            // console.log(results);// Kthehet rezultati në format JSON
            // res.sendFile(path.join(__dirname, 'assets', 'views', 'rezervimetDashboard.html'));
        }
    });
  
});

app.get('/rezervimeDashboard', verifySession, (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'views', 'rezervimetDashboard.html'));
});

app.post('/administration', (req, res) => {
  const password = req.body.password;
  if (password === '0000') {
      req.session.loggedin = true; // ruaj informacionin në sesion
      req.session.cookie.maxAge = 120000; // reseto kohën e sesionit në 10 minuta
      res.redirect('/administration');
  } else {
      res.send('Fjalëkalimi i gabuar!');
      res.redirect('/admin')
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Sesioni u shkëput.');
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



