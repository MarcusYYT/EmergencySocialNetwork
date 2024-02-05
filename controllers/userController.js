import * as userService from '../services/userService.mjs';


export function showLogin(req, res) {
    res.render('Login'); 
}

export function showRegister(req, res) {
    res.render('Register')
}

export async function register(req, res) {
    try{
        // TO-DO

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function login(req, res) {
    try {
        // temp implementation, need to replace by web token
        const username = req.nody.username;
        const password = req.body.password; 
        const user = await userService.Authenticate();
        
        // Need to implement After the authenticate function 
        // res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
