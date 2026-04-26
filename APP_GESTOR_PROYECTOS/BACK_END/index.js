const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const errorMiddleware = require('./src/middlewares/error.middleware');
require('dotenv').config();

// Rutas
const proyectosRoutes = require('./src/routes/proyectos.routes');
const tareasRoutes = require('./src/routes/tareas.routes');
const prioridadesRoutes = require('./src/routes/prioridades.routes');
const estadosRoutes = require('./src/routes/estados.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/prioridades', prioridadesRoutes);
app.use('/api/estados', estadosRoutes);

// Ruta raiz
app.get('/', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'API Gestión de Proyectos',
        docs: `http://localhost:${PORT}/api-docs`
    });
});

// Middleware de errores
app.use(errorMiddleware);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 Swagger UI:  \x1b[36mhttp://localhost:${PORT}/api-docs\x1b[0m`);
});