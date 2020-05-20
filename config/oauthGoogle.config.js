require('dotenv').config()
const userModel = require('../models/user.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

////////
const oauthGoogle = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENTID,
                clientSecret: process.env.GOOGLE_CLIENTSECRET,
                callbackURL: '/auth/google/callback'
            }, async (accessToken, refreshToken, profile, done) => {
                if (!profile) {
                    return done(null, false);
                }

                const userGoogle = await userModel.findOrCreate({
                    where: {
                        email: profile.emails[0].value
                    },
                    defaults: {
                        name: profile.name.familyName + ' ' + profile.name.givenName,
                    }

                }).spread((user, created) => {
                    if (created) {
                        return done(null, user);
                    } else {
                        return done(null, user);
                    }
                })
            }

        )
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

module.exports = oauthGoogle;
