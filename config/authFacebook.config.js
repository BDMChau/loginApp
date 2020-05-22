const FacebookStrategy = require('passport-facebook').Strategy;
const userModel = require('../models/user.model');
const keys = require('../keys')

////////
const authFacebook = function (passport) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: keys.FACEBOOK_APPID,
                clientSecret:keys.FACEBOOK_APPSECRET,
                callbackURL: '/auth/facebook/callback',
                profileFields: ['id', 'displayName', 'email']
            }, async (accessToken, refreshToken, profile, done) => {
                if (!profile) {
                    return done(null, false);
                }

                const userFacebook = await userModel.findOrCreate({
                    where: {
                        facebookid: profile.id
                    },
                    defaults: {
                        email: profile.emails[0].value,
                        name: profile.name.familyName + ' ' + profile.name.givenName
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

module.exports = authFacebook;
