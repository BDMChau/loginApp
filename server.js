const express = require('express');
const path = require('path');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 4000;

const expressLayouts = require('express-ejs-layouts');

const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const passportConfig = require('./config/passport.config')(passport);
const oauthGoogle = require('./config/oauthGoogle.config')(passport);
const authFacebook = require('./config/authFacebook.config')(passport);
const flashConfig = require('./config/flash.config');
const authMiddleware = require('./middleware/auth.middleware');

const indexRoute = require('./routes/index.route');
const logRoute = require('./routes/log.route');
////////////

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extend: false}))

app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true,
  }))

app.use(flash())
app.use(flashConfig)

app.use(passport.initialize());
app.use(passport.session());
///////////

app.use('/', logRoute);
app.use('/user', authMiddleware, indexRoute);
///////////

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})