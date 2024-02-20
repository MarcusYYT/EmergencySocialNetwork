import * as userService from "../services/userService.mjs";
import { ifUserExist, changeStatus } from "../models/User.model.mjs";
// import jwt from "jsonwebtoken";

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
                        await userService.createNewUser(username, password);
                        res.status(201).json({ success: true, message: 'Registration successful' });
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
    // temp implementation, need to replace by web token
    const username = req.body.username;
    console.log(req.body)
    const password = req.body.password;
    console.log(password)
    await userService.authenticate(username, password).then((resolve)=>{
        console.log(resolve)
        if(resolve.match === true){
            changeStatus(resolve.id, "online")
            res.end("Login Successful")
        }  
    //res.json({ message: "Login Successful", token: token });
    // res.end("Login Successful")
        else {
        res.redirect("/auth/login?LoginSuc=false");
        }
    });
    // if (!user || user.length === 0) {
    //   const payload = {
    //     id: user.user_id,
    //     username: user.username,
    //   };
    
    //   const token = jwt.sign(payload, "sb1sb1", { expiresIn: "1h" });
    

  } catch (error) {
    res.status(500).send(error.message);
  }
}
