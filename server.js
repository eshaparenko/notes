const express = require('express');
const app = express();
const path = require('path');
//Read port number from .env file if exist
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookierParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

connectDB();

app.use(logger)

app.use(express.json());

app.use(cookierParser());

app.use(cors(corsOptions));


//Build in middleware express.static()
app.use('/', express.static(path.join(__dirname, 'public')));
// Will work the save way
// app.use(express.static('public'));

app.use('/', require('./routes/root'));
app.use('/users', require('./routes/userRoutes'));
app.use('/notes', require('./routes/noteRouters'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not found')
    }
})

app.use(errorHandler);



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    })
})

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})