const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const connection = require('mongoose').connection;
const User = connection.models.users;
const keys = require('../config/keys')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt
}

const verifyCallback = async (payload, done) => {
  try {
    const user = await User.findById(payload.userId).select('id email isAdmin')

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  } catch (e) {
    done(e)
  }
}

const strategy = new JwtStrategy(options, verifyCallback)

passport.use(strategy)