import express from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import {User} from './models/User.model.mjs'
import {Post} from './models/Post.model.mjs'
// import passport from './config/passportConfig.mjs';

// import routing
import authRoutes from './routes/authRoutes.mjs'
import userRoutes from './routes/userRoutes.mjs'
import postRoutes from './routes/postRoutes.mjs'

const swaggerOptions = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ESN Restful API',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.mjs'],
  };

// get the root folder for the project
const root = process.cwd();
const __dirname = root;

const app = express();
const port = 3000;
// app.use(passport.initialize());

app.use(express.static(__dirname +'/public'));
app.use(express.json());  // parse json request  
app.use(express.urlencoded({ extended: true }));

// set the view and pug engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Router setting
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // TO-DO: Check if the user was already login
//     // res.json({ message: 'You are authenticated!', user: req.user });
//     res.render('Home');

// });
// setup swagger
const swaggerSpec = await swaggerJSDoc(swaggerOptions);
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.get('/', (req, res) => {
    // TO-DO: Check if the user was already login
    // res.json({ message: 'You are authenticated!', user: req.user });
    res.render('Home');

});

app.get('/test', (req,res) =>{
  res.render('Test');
})

app.get('/directory', (req,res) =>{
  res.render('Test');
})

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    // await User.sync()
    // await Post.sync()
});

export default app;

