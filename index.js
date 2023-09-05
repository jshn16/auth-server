const express = require('express')
const bcrypt = require('bcrypt')
const cors = require("cors");
const bodyParser = require('body-parser')
const localeStratergy = require('passport-local').Strategy;
//declaring user model
const userModel = require('./models/user');
const app = express();
//checking enviroment status
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();

}

//mongoose connection
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING).then((responce) => {
  console.log('Connected to mongoose');
}).catch((error) => {
  console.log('Disconnected from mongoose');
})

const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
passport.use(userModel.createStrategy())

app.use(express.json());
app.use(bodyParser.json())

//using CORS for request
app.use(
  cors({
    // origin: "http://localhost:3000",
    // origin: "https://auth-client-80ok.onrender.com",
    
    // credentials: true,
  })
);


app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: false

}));


app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


passport.use(localeStratergy)

//register functionality

app.post('/register', (req, res) => {


  userModel.register(new userModel({
    username: req.body.username,
    email: req.body.email,
  }), req.body.password,
    (error, user) => {
      if (user) {
        console.log(user)
        res.json(user)
      }
      else {
        console.log(error)
      }
    });

})



app.post('/login', (req, res) => {
  passport.authenticate('local', (error, user) => {

    if (user) {
    
      console.log(user)
      res.json(user)
    }
    if(!user) {
      console.log('User Not Found')
     
    }
    if (error) {
      console.log(error)
    }

  })(req, res)
})



app.listen(4000, () => {
  console.log("server running")
})

module.exports = app;
