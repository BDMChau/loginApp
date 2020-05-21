const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

////////
const passportConfig = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            const user = userModel.findAll({
                raw: true,
                plain: true,
                where: {
                    email: email
                }
            })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            message: 'Email is wrong or does not exist!'
                        });
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }

                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, {
                                message: 'Password incorrect!'
                            })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err);
                })


        })

    )

    ////////
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser((userId, done) => {
        const user = userModel.findAll({
            limit: 1,
            where: {
                id: userId
            }
        })
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    })

}

module.exports = passportConfig;
