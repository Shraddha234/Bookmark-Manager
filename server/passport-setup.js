const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../server/models/userModel');

// Configure JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'edfac82df00ee136247be6215b6eced87203f52b7e8253b87032da0847eb1aab',
};

// Create JWT strategy
const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.data._id); // Assuming your user model has an 'id' field
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

// Initialize Passport and use the JWT strategy
passport.use(jwtStrategy);

module.exports = passport;
