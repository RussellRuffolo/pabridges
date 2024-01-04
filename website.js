const express = require('express');
const path = require('path');

const app = express();
const port = 3000; // You can change the port number if needed

// Set the path for static files (like map.js)
app.use(express.static(path.join(__dirname, 'Public')));

// Route to serve map.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'map.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});