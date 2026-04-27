import api from './api';

const tareasService = {

    // Nuevo: Obtener catalogo de estados (igual que proyectos)
    obtenerEstados: () => {
        return api.get('/estados');
    },

    obtener: (proyectoId, filtros = {}) => {
        return api.get(`/proyectos/${proyectoId}/tareas`, { params: filtros });
    },

    insertar: (proyectoId, data) => {
        return api.post(`/proyectos/${proyectoId}/tareas`, data);
    },

    actualizar: (proyectoId, id, data) => {
        return api.patch(`/proyectos/${proyectoId}/tareas/${id}`, data);
    },

    eliminar: (proyectoId, id) => {
        return api.delete(`/proyectos/${proyectoId}/tareas/${id}`);
    }
};

export default tareasService;