// Requiring module
const express = require('express');
const serve = require('express-static');
const cors = require('cors');

// Creating express app object
const app = express();
  
// CORS is enabled for all origins
app.use(cors());
app.use(serve('./public'))

app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

// Port Number
const port = 1337;
  
// Server setup
app.listen(port, () => `Server running on port ${port}`);