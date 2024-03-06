import express from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import {PrivatePost} from "./models/PrivatePost.model.mjs";
import {User} from './models/User.model.mjs'
import {Post} from './models/Post.model.mjs'
import socketConfig from './config/socketConfig.mjs'
import authRoutes from './routes/authRoutes.mjs'
import userRoutes from './routes/userRoutes.mjs'
import postRoutes from './routes/postRoutes.mjs'
import pageRoutes from './routes/pageRoutes.mjs'
import DatabaseAdapter from './config/DatabaseAdapter.mjs'
import { createServer } from 'node:http';
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';


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

// set the view and pug engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Router setting
app.use('', pageRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

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

server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  const database = DatabaseAdapter.createDatabase();
  await database.connect();
  await PrivatePost.sync()

  if(process.env.NODE_ENV === 'test'){
    await User.sync()
    await Post.sync()
    await PrivatePost.sync()
  }
});

export default app;

