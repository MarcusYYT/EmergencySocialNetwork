import * as userService from '../services/userService.mjs';


export function showLogin(req, res) {
    res.render('Login'); 
}

export function showRegister(req, res) {
    res.render('Register')
}

export async function register(req, res) {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const userCheck = await userService.ifUserExist(username).then(async (result)=>{
            if(result === true){
                console.log("The User is exist")
                res.redirect('/users/register/?success=false');
            } else{
                console.log("The User is not exist")
                await userService.createNewUser(username, password);
                res.redirect('/?success=true');
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
        const ifMatch = await userService.Authenticate(username, password);
        if (ifMatch === true){
            res.end("Login Successful")
        } else {
            res.redirect('/users/login?LoginSuc=false')
        }
        // Need to implement After the authenticate function 
        // res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
