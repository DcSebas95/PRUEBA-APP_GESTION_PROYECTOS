import {
    Card, CardContent, CardActions,
    Typography, Button, Chip, Box,
    Tooltip, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskIcon from '@mui/icons-material/Task';

const coloresPrioridad = {
    'Alta': 'error',
    'Media': 'warning',
    'Baja': 'success'
};

const coloresEstado = {
    'Nuevo': 'default',
    'Activo': 'primary',
    'Finalizado': 'success',
    'Resuelto': 'secondary'
};

function ProyectoCard({ proyecto, onVerTareas, onEditar, onEliminar }) {
    return (
        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>

                {/* Nombre del proyecto */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" noWrap>
                        {proyecto.proyecto}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" noWrap>
                        ID: {proyecto.proyecto_id}
                    </Typography>
                </Box>

                {/* Descripcion */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {proyecto.proyecto_descripcion || 'Sin descripción'}
                </Typography>

                {/* Chips de estado y prioridad */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                        label={proyecto.proyecto_estado}
                        color={coloresEstado[proyecto.proyecto_estado] || 'default'}
                        size="small"
                    />
                    <Chip
                        label={proyecto.proyecto_prioridad}
                        color={coloresPrioridad[proyecto.proyecto_prioridad] || 'default'}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                {/* Total tareas y fecha */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


                    {proyecto.proyecto_creado && (
                        <Typography variant="caption" color="text.secondary">
                            Creado: {new Date(proyecto.proyecto_creado).toLocaleDateString('es-CO')}
                        </Typography>
                    )}
                    {proyecto.proyecto_fecha_entrega && (
                        <Typography variant="caption" color="text.secondary">
                            Entrega: {new Date(proyecto.proyecto_fecha_entrega).toLocaleDateString('es-CO')}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TaskIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {proyecto.total_tareas} tarea(s)
                        </Typography>
                    </Box>

                </Box>

            </CardContent>

            {/* Acciones */}
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={onVerTareas}
                >
                    Ver Tareas
                </Button>
                <Box>
                    <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={onEditar}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={onEliminar}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card >
    );
}

export default ProyectoCard;