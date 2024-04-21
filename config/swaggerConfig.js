// config/swaggerConfig.js
export const swaggerOptions = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ESN Restful API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'],
};
