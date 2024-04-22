import fs from 'fs'
import express from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import socketConfig from './config/socketConfig.js'
import passport from './config/passportConfig.js'
import router from './routes/index.js'
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import {swaggerOptions} from "./config/swaggerConfig.js";
import {cleanUpDatabase, initializeDatabase} from "./utils/databaseUtils.js";

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


app.use(router)

// setup swagger
const swaggerSpec = await swaggerJSDoc(swaggerOptions);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  cleanUpDatabase()
  await initializeDatabase();
});

export default app;