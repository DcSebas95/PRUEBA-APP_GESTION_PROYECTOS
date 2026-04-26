const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gestión de Proyectos',
            version: '1.0.0',
            description: 'API REST para gestión de proyectos y tareas'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
        tags: [
            { name: 'Proyectos', description: 'Endpoints de proyectos' },
            { name: 'Tareas', description: 'Endpoints de tareas' },
            { name: 'Catalogos', description: 'Endpoints de catalogos' }
        ]
    },
    apis: ['./src/routes/*.js']  // ← lee los comentarios de las rutas
};

module.exports = swaggerJsdoc(options);