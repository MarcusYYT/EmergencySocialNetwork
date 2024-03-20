import fs from 'fs'
import express from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import {PrivatePost} from "./models/PrivatePost.model.js";
import {User} from './models/User.model.js'
import {Post} from './models/Post.model.js'
import {Status} from './models/Status.model.js'
import socketConfig from './config/socketConfig.js'
import passport from './config/passportConfig.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import privatePostRoutes from './routes/privatePostRoutes.js'
import pageRoutes from './routes/pageRoutes.js'
import statusRoutes from './routes/statusRoutes.js'
import DatabaseAdapter from './config/DatabaseAdapter.js'
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';


const swaggerOptions = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ESN Restful API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

// get the root folder for the project
const root = process.cwd();
const __dirname = root;

const app = express();
const port = 3000;
const server = createServer(app);
socketConfig(server);

app.use(express.static(__dirname + '/public'));
app.use(express.json());  // parse json request  
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(cookieParser());

// set the view and pug engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Router setting
app.use('', pageRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/status', statusRoutes)
app.use('/privatePosts', privatePostRoutes)

// setup swagger
const swaggerSpec = await swaggerJSDoc(swaggerOptions);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// app.listen(port, async () => {
//     console.log(`Server running at http://localhost:${port}`);
//     // await User.sync()
//     // await Post.sync()
// });
function cleanUpDatabase() {
  return fs.unlink('./tempdb.sqlite', (err) => {
    console.log("The file is deleted")
      if (err) {
          console.error('Failed to delete database file:', err);
      } else {
          console.log('Database file deleted successfully.');
      }
  });
}

server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  if(process.env.NODE_ENV === 'test'){
    // cleanUpDatabase()
  }
  const database = DatabaseAdapter.createDatabase();
  await database.connect();
  // await Status.sync()
  await PrivatePost.sync()

  if(process.env.NODE_ENV === 'test'){
    await User.sync()
    await Post.sync()
    await PrivatePost.sync()
    await Status.sync()
  }
});

export default app;

