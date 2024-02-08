import * as userService from "../services/userService.mjs";
import jwt from "jsonwebtoken";

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
                res.redirect('/users/register/?usernameValid=false')
            } else {
                await userService.ifUserExist(username).then(async (result)=>{
                    if(result === true){
                        console.log("The User is exist")
                        res.redirect('/users/register/?success=false');
                    } else{
                        console.log("The User is not exist")
                        await userService.createNewUser(username, password);
                        res.redirect('/?success=true');
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
    const password = req.body.password;
    const user = await userService.Authenticate(username, password);
    if (!user || user.length === 0) {
      const payload = {
        id: user._id,
        username: user.username,
      };
      const token = jwt.sign(payload, "sb1sb1", { expiresIn: "1h" });
      res.json({ message: "Login Successful", token: token });
      // res.end("Login Successful")
    } else {
      res.redirect("/users/login?LoginSuc=false");
    }

  } catch (error) {
    res.status(500).send(error.message);
  }
}
