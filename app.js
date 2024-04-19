import fs from 'fs'
import express from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import socketConfig from './config/socketConfig.js'
import passport from './config/passportConfig.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import privatePostRoutes from './routes/privatePostRoutes.js'
import announcementRoutes from './routes/announcementRoutes.js'
import threadRoutes from './routes/threadRoutes.js'
import threadPostRoutes from './routes/threadPostRoutes.js'
import pageRoutes from './routes/pageRoutes.js'
import statusRoutes from './routes/statusRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import testRoute from './routes/testRoutes.js'
import emergencyContactRoutes from './routes/emergencyContactRoutes.js'
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

let isPerformanceTestMode = false;

export function setPerformanceTestMode(mode) {
    isPerformanceTestMode = mode;
}

export function getPerformanceTestMode() {
    return isPerformanceTestMode;
}

// filter non-test request
app.use((req, res, next) => {
    if (getPerformanceTestMode() && !req.headers['x-performance-test']) {
        return res.status(503).send('Service temporarily unavailable due to performance testing');
    }
    next();
});

// Router setting
app.use('', pageRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/status', statusRoutes)
app.use('/privatePosts', privatePostRoutes)
app.use('/announcements', announcementRoutes)
app.use('/threads', threadRoutes)
app.use('/threadPosts', threadPostRoutes)
app.use('/emergencyContacts', emergencyContactRoutes);
app.use('/search', searchRoutes)
app.use('/test', testRoute);

// setup swagger
const swaggerSpec = await swaggerJSDoc(swaggerOptions);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export function cleanUpDatabase() {
  if (fs.existsSync('./tempdb.sqlite')) {
    return fs.unlink('./tempdb.sqlite', (err) => {
      if (err) {
        console.error('Failed to delete database file:', err);
      } else {
        console.log('Database file deleted successfully.');
      }
    });
  } else {
    console.log('Database file does not exist, no need to delete.');
  }
}

server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  cleanUpDatabase()
  if(process.env.NODE_ENV === 'test'){
    DatabaseAdapter.setTestDatabaseName("tempdb.sqlite")
    DatabaseAdapter.setCurrentDatabase('test')
    const database = DatabaseAdapter.getDatabase();
    await database.authenticate();
    console.log("Connected to in-memeory test database");
    console.log("initializing models...")
    await DatabaseAdapter.reinitializeModels();
    console.log("done")
  } else {
    DatabaseAdapter.setCurrentDatabase('default');
    const database = DatabaseAdapter.getDatabase();
    await database.authenticate();
    console.log("Connected to MySQL database");
    console.log("initializing models...")
    await DatabaseAdapter.reinitializeModels();
    console.log("done")
  }
});

export default app;