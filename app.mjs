import fs from 'fs'
import express from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import {PrivatePost} from "./models/PrivatePost.model.mjs";
import {User} from './models/User.model.mjs'
import {Post} from './models/Post.model.mjs'
import {Status} from './models/Status.model.mjs'
import {Announcement} from './models/Announcement.model.mjs'
import socketConfig from './config/socketConfig.mjs'
import passport from './config/passportConfig.mjs'
import authRoutes from './routes/authRoutes.mjs'
import userRoutes from './routes/userRoutes.mjs'
import postRoutes from './routes/postRoutes.mjs'
import privatePostRoutes from './routes/privatePostRoutes.mjs'
import pageRoutes from './routes/pageRoutes.mjs'
import statusRoutes from './routes/statusRoutes.mjs'
import announcementRoutes from './routes/announcementRoutes.mjs'
import DatabaseAdapter from './config/DatabaseAdapter.mjs'
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
  apis: ['./routes/*.mjs'],
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
app.use('/announcements', announcementRoutes)


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
  //await Announcement.sync()

  if(process.env.NODE_ENV === 'test'){
    await User.sync()
    await Post.sync()
    await PrivatePost.sync()
    await Status.sync()
    await Announcement.sync()
  }
});

export default app;

