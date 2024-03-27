import * as userService from "../services/userService.js";
import { User} from "../models/User.model.js";
import passport from "../config/passportConfig.js";
import jwt from "jsonwebtoken";
import { io } from "../config/socketConfig.js"

export function showLogin(req, res) {
  res.render("Login");
}

export function showRegister(req, res) {
  res.render("Register");
}

export async function register(req, res) {
    try{
        const username = req.body.username;
        const password = req.body.password;
        await userService.isUsernameValid(username).then(async (resolve)=>{
            if(resolve === false){
                console.log("username is not valid");
                res.status(409).json({ success: false, message: 'Username invalid' });
            } else {
                await User.ifUserExist(username).then(async (result)=>{
                    if(result === true){
                        console.log("The User is exist")
                        res.status(409).json({ success: false, message: 'Username Exist' });
                    } else{
                        console.log("The User is not exist")

                        await userService.createNewUser(username, password).then((user)=>{
                            const newUserId = user.user_id;
                            console.log(newUserId)
                            const token = jwt.sign({ user_id: newUserId }, process.env.JWT_SECRET_KEY || 'sb1sb1', { expiresIn: '1h' });
                            res.status(201).json({ success: true, user_id: newUserId, token, message: 'Registration successful' });

                        });
                        
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


// Optimized json content. Changed code:404/200 to success:true/false to keep the consistancy of restful api format.
export async function login(req, res) {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (!user) {
            const statusCode = info.code || 401; 
            return res.status(statusCode).json({ success: false, message: info.message });
        } else {
            User.changeOnlineStatus(user.user_id, "online")
            const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET_KEY || 'sb1sb1', { expiresIn: '1h' });
            res.status(200).json({ success: true, user_id: user.user_id, token, message: 'Login successful' });
        }
    })(req, res);
}

export async function tokenResolve(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({
        success: true,
        user_id: req.user.data[0].user_id
    });
}

export async function logout(req, res){
    io.emit("status_update");
    res.clearCookie();
}