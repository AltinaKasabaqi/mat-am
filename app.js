const express = require('express');
const path = require('path');


const app = express();
const port = 3000;

// Vendos rrugën për të shërbyer skedarët statikë
app.use(express.static(path.join(__dirname, 'assets')));


// Rruga për të shfaqur faqen HTML në rrugën kryesore
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'views', 'index.html'));
});

// Dëgjo për kërkesa në portin e caktuar
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
