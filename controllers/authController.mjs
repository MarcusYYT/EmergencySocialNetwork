import * as userService from "../services/userService.mjs";
import { ifUserExist, changeOnlineStatus } from "../models/User.model.mjs";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

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
                await ifUserExist(username).then(async (result)=>{
                    if(result === true){
                        console.log("The User is exist")
                        res.status(409).json({ success: false, message: 'Username Exist' });
                    } else{
                        console.log("The User is not exist")
                        await userService.createNewUser(username, password).then(async (user)=>{
                            const payload = {
                                id: user.user_id,
                                username: user.username,
                            };
                            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
                            await changeOnlineStatus(resolve.id, "online")
                            res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour
                            res.status(201).json({ success: true, user_id: user.user_id, token: token, message: 'Registration successful' });
                        });
                        
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function login(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    await userService.authenticate(username, password).then(async (resolve)=>{
        console.log(resolve)
        if(resolve.code === 200){
            const payload = {
                id: resolve.id,
                username: username
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            await changeOnlineStatus(resolve.id, "online")
            res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour
            res.status(200).json({code: 200, message:resolve.message, user_id: resolve.id, token: token})
        } 
        else {
            res.status(resolve.code).json({code: resolve.code, message:resolve.message})
        }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
