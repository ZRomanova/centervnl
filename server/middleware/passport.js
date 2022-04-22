const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('mongoose').connection;
const User = connection.models.users;
const { validPassword } = require('../middleware/password')

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {

    User.findOne({ email: username.toLowerCase() })
        .then((user) => {
            
            if (!user) return done(null, false) 
            const isValid = validPassword(user.password, password);
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {   
            console.log('local', err)
            done(err);
        });

}

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});

