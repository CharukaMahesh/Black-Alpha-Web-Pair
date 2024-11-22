const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const app = express();
__path = process.cwd();
const PORT = process.env.PORT || 8000;

let code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;

// Session configuration
app.use(session({
    secret: 'black-alpha', // Secret key for signing the session ID
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to handle routes
app.use('/code', code);

app.use('/', async (req, res, next) => {
    // Initializing session data
    if (!req.session.userID) {
        req.session.userID = 'black-alpha-' + Math.random().toString(36).substring(2, 15); // Unique session ID
    }
    console.log(`Session ID: ${req.session.userID}`);
    res.sendFile(__path + '/pair.html');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start server
app.listen(PORT, () => {
    console.log(`⏩ Server running on http://localhost:` + PORT);
});

module.exports = app;
