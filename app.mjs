import express from 'express';
import path from 'path';
// import database model
import {User} from './models/User.model.mjs'
import passport from './config/passportConfig.mjs';

// import routing
import authRoutes from './routes/authRoutes.mjs';

// get the root folder for the project
const root = process.cwd();
const __dirname = root;

const app = express();
app.use(express.json()); 
const port = 3000;
app.use(passport.initialize());

app.use(express.static(__dirname +'/public'));
app.use(express.json());      // parse json request
app.use(express.urlencoded({ extended: true }));

// set the view and pug engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Router setting
app.use('/users', authRoutes);

app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // TO-DO: Check if the user was already login
    // res.json({ message: 'You are authenticated!', user: req.user });
    res.render('Home');

});

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    await User.sync();
});

