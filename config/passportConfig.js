import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import * as userService from "../services/userService.js";
import LocalStrategy from "passport-local";

passport.use('local-login', new LocalStrategy( {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async function(req, username, password, done) {
    try {
        const authRes = await userService.validUser(username, password);
        console.log(authRes);
        if (authRes.code == 401) {
            return done(null, false, { code: 401, message: "Username and Password does not match"});
        } else if (authRes.code == 404) {
            return done(null, false, { code: 404, message: "User does not exist"});
        } else if (authRes.code == 200) {
            const user = { user_id: authRes.user_id, username: username};
            return done(null, user);
        } else if(authRes.code === 403) {
            return done(null, false, { code: 403, message: "Your account was set to Inactive by an administrator"})
        }
    } catch (err) {
        return done(err);
    }
})
);

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

var opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET_KEY || 'sb1sb1'
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await userService.getUserById(jwt_payload.user_id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
