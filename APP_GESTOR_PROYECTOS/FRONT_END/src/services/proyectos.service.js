import api from './api';

const proyectosService = {

    obtener: (filtros = {}) => {
        return api.get('/proyectos', { params: filtros });
    },

    insertar: (data) => {
        return api.post('/proyectos', data);
    },

    actualizar: (id, data) => {
        return api.patch(`/proyectos/${id}`, data);
    },

    eliminar: (id) => {
        return api.delete(`/proyectos/${id}`);
    },

    obtenerEstados: () => {
        return api.get('/estados');
    },

    obtenerPrioridades: () => {
        return api.get('/prioridades');
    }
};

export default proyectosService;