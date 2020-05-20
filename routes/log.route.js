const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render("layouts/login");
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_flash', 'Logged out!');
    res.redirect('/')
})

router.get('/register', (req, res) => {
    res.render("layouts/register");
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({
            message: 'Please fill out all fields!'
        })
    }

    if (password.length < 6) {
        errors.push({
            message: 'Password is at least 6 characters!'
        })
    }

    if (password !== password2) {
        errors.push({
            message: 'Password do not match!'
        })
    }

    if (errors.length > 0) {
        res.render("layouts/register", {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // hash pass
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    throw err
                }
                const user = await userModel.findOrCreate({
                    where: {
                        email: email
                    },
                    defaults: {
                        name: name,
                        password: hash
                    }

                }).spread((user, created) => {
                    if (created) {
                        console.log(user.dataValues);
                        req.flash('success_flash', 'Sign Up Success, now you can sign in!')
                        res.redirect('/');

                    } else {
                        errors.push({
                            message: 'Email is already exists!',
                            message2: 'Or maybe you have logged in with Google or Facebook before!'
                        })
                        return res.render("layouts/register", {
                            errors,
                            name,
                            email,
                            password,
                            password2
                        });
                    }
                })
            })
        })


    }






})

// login post
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/',
        successRedirect: '/user',
        failureFlash: true
    })(req, res, next);
})

// login oauth google
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        successRedirect: '/user',
        failureFlash: true
    })
);


//login facebook
router.get('/auth/facebook',
    passport.authenticate('facebook', {
        scope: ['user_friends', 'manage_pages']
    })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/',
        successRedirect: '/user',
        failureFlash: true
    }),
    (req, res) => {
        // Success.
        res.redirect('/user');
    });

module.exports = router;