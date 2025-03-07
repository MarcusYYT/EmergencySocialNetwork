// MySQL database adapter
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export default class MySQLDatabase {
    constructor() {
        
        // Get database configuration from environment variables with fallbacks
        const dbName = process.env.DB_NAME || 'Emergency_Social_Network';
        const dbUser = process.env.DB_USER || 'root';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbPort = process.env.DB_PORT || 3306;
        
        
        // Connection options
        const options = {
            host: dbHost,
            port: dbPort,
            dialect: 'mysql',
            logging: process.env.NODE_ENV === 'development',
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        };
        
        // Add SSL if configured
        if (process.env.DB_SSL === 'true') {
            options.dialectOptions = {
                ssl: {
                    require: true,
                    rejectUnauthorized: false // You might want to set this to true in production
                }
            };
        }
        
        this.sequelize = new Sequelize(dbName, dbUser, dbPassword, options);
    }
}