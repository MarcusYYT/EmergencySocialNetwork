import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import * as userService from "../services/userService.mjs";
import LocalStrategy from "passport-local";

passport.use('local-login', new LocalStrategy( {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // 允许将整个请求传递给回调函数
    }, async function(req, username, password, done) {
        try {
            const authRes = await userService.validUser(username, password);
            if (authRes == -1) {
                return done(null, false, { message: "Username and Password does not match"});
            } else if (authRes == -2 ) {
                return done(null, false, { message: "User does not exist"});
            } else {
                const user = { user_id: authRes, username: username};
                return done(null, user);
            }
        } catch (err) {
            return done(err);
        }
    })
);

//
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "sb1sb1";
// passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//         User.findOne({ id: jwt_payload.sub }, function (err, user) {
//             if (err) {
//                 return done(err, false);
//             }
//             if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//             }
//         });
//     })
// );



export default passport;
