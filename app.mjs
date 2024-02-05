import express from 'express';
import path from 'path';
// import database
import {sequelize, User}  from './config/database.mjs';

// import routing
import authRoutes from './routes/authRoutes.mjs';

// get the root folder for the project
const root = process.cwd();
const __dirname = root;

const app = express();
const port = 3000;

app.use(express.static(__dirname +'/public'));
app.use(express.json());      // parse json request
app.use(express.urlencoded({ extended: true }));

// set the view and pug engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Router setting
app.use('/users', authRoutes);

app.get('/', (req, res) => {
    // TO-DO: Check if the user was already login
    res.redirect('/users/login');
});

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    const users = await User.findAll();
    console.log(users); // true
});

