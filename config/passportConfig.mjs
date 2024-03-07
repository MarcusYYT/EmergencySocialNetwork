import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User.model.mjs';

const JWT_SECRET = 'your_secret_key'; // Use a secure key in production
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['token'];
    }
    return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;
