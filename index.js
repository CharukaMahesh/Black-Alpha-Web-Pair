const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const app = express();
__path = process.cwd();
const PORT = process.env.PORT || 8000;

let code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;

// Session configuration with 'black-alpha' prefix
app.use(session({
    secret: 'black-alpha', // Secret for signing the session ID
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware for routes
app.use('/code', code);

app.use('/', async (req, res, next) => {
    try {
        // Initialize session ID with 'black-alpha' prefix if not set
        if (!req.session.userID) {
            req.session.userID = 'black-alpha-' + Math.random().toString(36).substring(2, 15); // Generate unique session ID
        }
        console.log(`Session ID: ${req.session.userID}`);
        res.sendFile(__path + '/pair.html');
    } catch (error) {
        next(error); // Pass error to error handler
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);  // Log error
    res.status(500).send('Internal Server Error'); // Send a generic error response
});

// Start server
app.listen(PORT, () => {
    console.log(`⏩ Server running on http://localhost:` + PORT);
});

module.exports = app;
