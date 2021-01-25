// library imports
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

// routers
const router = require('./routes/main.js');

// global vars
const app = express();
const port = process.env.PORT || '8089';

// setup
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./routes/main')(app);

// setup the views and statics engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// start the server
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
