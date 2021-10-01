const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config(); 

const path       = require('path');
const userRoute  = require('./routes/user_route');
const sauceRoute = require('./routes/route');

mongoose.connect(process.env.ACCESS_TOKEN_SECRET_DB, {useNewUrlParser: true, useUnifiedTopology: true }, 
    (error) => {
    if(!error)console.log('MongoDB, connexion réussie')
    else console.log('MongoDB, connexion echoué ' + error)
});

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);

module.exports = app;