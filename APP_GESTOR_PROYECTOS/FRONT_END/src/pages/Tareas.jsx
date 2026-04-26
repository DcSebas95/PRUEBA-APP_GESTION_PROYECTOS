import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button,
    CircularProgress, Alert, Paper,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    IconButton, Tooltip, Chip,
    TablePagination, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import tareasService from '../services/tareas.service';
import { useApp } from '../context/AppContext';
import TareaForm from '../components/tareas/TareaForm';
import TareaFiltros from '../components/tareas/TareaFiltros';

const coloresEstado = {
    'Nuevo': 'default',
    'Activo': 'primary',
    'Finalizado': 'success',
    'Resuelto': 'secondary'
};

function Tareas() {
    const { id } = useParams();
    const navigate = useNavigate(); // ← faltaba
    const { proyectoActivo } = useApp();
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [abrirForm, setAbrirForm] = useState(false);
    const [tareaEditar, setTareaEditar] = useState(null);
    const [filtros, setFiltros] = useState({});
    const [pendientes, setPendientes] = useState([]);
    const [abrirConfirmVolver, setAbrirConfirmVolver] = useState(false);

    // Paginacion
    const [pagina, setPagina] = useState(0);
    const [filasPorPagina, setFilasPorPagina] = useState(5);

    // Cargar tareas
    const cargarTareas = async (filtrosActuales = {}) => {
        try {
            setLoading(true);
            setError(null);
            const res = await tareasService.obtener(id, filtrosActuales);
            setTareas(res.data.data);
            setPendientes([]);
            setPagina(0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTareas();
    }, [id]);

    // Marcar o desmarcar tarea para eliminar
    const marcarEliminar = (tareaId) => {
        setPendientes(prev =>
            prev.includes(tareaId)
                ? prev.filter(i => i !== tareaId)
                : [...prev, tareaId]
        );
    };

    // Cancelar todas las marcaciones
    const cancelarEliminacion = () => {
        setPendientes([]);
    };

    // Guardar cambios - eliminar todas las marcadas
    const guardarCambios = async () => {
        if (pendientes.length === 0) return;
        try {
            setLoading(true);
            await Promise.all(
                pendientes.map(tareaId => tareasService.eliminar(id, tareaId))
            );
            cargarTareas(filtros);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Editar tarea
    const editarTarea = (tarea) => {
        setTareaEditar(tarea);
        setAbrirForm(true);
    };

    // Guardar tarea desde formulario
    const guardarTarea = () => {
        setAbrirForm(false);
        setTareaEditar(null);
        cargarTareas(filtros);
    };

    // Aplicar filtros
    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        cargarTareas(nuevosFiltros);
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return '—';
        return new Date(fecha).toLocaleDateString('es-CO');
    };

    // Tareas de la pagina actual ← corregido
    const tareasPaginadas = tareas.slice(
        pagina * filasPorPagina,
        pagina * filasPorPagina + filasPorPagina
    );

    // Manejar click en volver
    const handleVolver = () => {
        if (pendientes.length > 0) {
            setAbrirConfirmVolver(true);
        } else {
            navigate('/');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>

            {/* Encabezado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Volver a proyectos">
                        <IconButton onClick={handleVolver}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            {proyectoActivo?.proyecto || 'Tareas'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {tareas.length} tarea(s) encontrada(s)
                            {pendientes.length > 0 && (
                                <span style={{ color: 'red', marginLeft: 8 }}>
                                    · {pendientes.length} marcada(s) para eliminar
                                </span>
                            )}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { setTareaEditar(null); setAbrirForm(true); }}
                >
                    Nueva Tarea
                </Button>
            </Box>

            {/* Filtros */}
            <TareaFiltros onFiltrar={aplicarFiltros} />

            {/* Error */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Tabla de tareas */}
            {!loading && (
                <>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Título</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>F. Creación</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>F. Límite</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>F. Entrega</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tareasPaginadas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Alert severity="info">
                                                No hay tareas registradas para este proyecto
                                            </Alert>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tareasPaginadas.map(tarea => {
                                        const marcada = pendientes.includes(tarea.tarea_id);
                                        return (
                                            <TableRow
                                                key={tarea.tarea_id}
                                                hover
                                                sx={{
                                                    backgroundColor: marcada ? '#ffebee' : 'inherit',
                                                    opacity: marcada ? 0.6 : 1,
                                                    '&:last-child td': { border: 0 }
                                                }}
                                            >
                                                <TableCell>{tarea.tarea_id}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                        sx={{ textDecoration: marcada ? 'line-through' : 'none' }}
                                                    >
                                                        {tarea.tarea}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {tarea.tarea_descripcion || '—'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={tarea.tarea_estado}
                                                        color={coloresEstado[tarea.tarea_estado] || 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{formatearFecha(tarea.tarea_creada)}</TableCell>
                                                <TableCell>{formatearFecha(tarea.tarea_fecha_limite)}</TableCell>
                                                <TableCell>{formatearFecha(tarea.tarea_fecha_entrega)}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => editarTarea(tarea)}
                                                            disabled={marcada}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={marcada ? 'Desmarcar' : 'Marcar para eliminar'}>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => marcarEliminar(tarea.tarea_id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Paginacion */}
                        <TablePagination
                            component="div"
                            count={tareas.length}
                            page={pagina}
                            onPageChange={(e, nuevaPagina) => setPagina(nuevaPagina)}
                            rowsPerPage={filasPorPagina}
                            onRowsPerPageChange={(e) => {
                                setFilasPorPagina(parseInt(e.target.value, 10));
                                setPagina(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count}`
                            }
                        />
                    </TableContainer>

                    {/* Botones siempre visibles */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<CancelIcon />}
                            onClick={cancelarEliminacion}
                            disabled={pendientes.length === 0}
                        >
                            Cancelar {pendientes.length > 0 && `(${pendientes.length})`}
                        </Button>
                        <Button
                            id="btn-guardar-cambios"
                            variant="contained"
                            color="error"
                            startIcon={<SaveIcon />}
                            onClick={guardarCambios}
                            disabled={pendientes.length === 0}
                        >
                            Confirmar Eliminación {pendientes.length > 0 && `(${pendientes.length})`}
                        </Button>
                    </Box>
                </>
            )}

            {/* Formulario crear/editar */}
            <TareaForm
                open={abrirForm}
                tarea={tareaEditar}
                proyectoId={id}
                onClose={() => { setAbrirForm(false); setTareaEditar(null); }}
                onGuardar={guardarTarea}
            />

            {/* Dialog confirmacion volver */}
            <Dialog open={abrirConfirmVolver} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    ⚠️ Cambios pendientes
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Tienes <strong>{pendientes.length} tarea(s)</strong> marcadas
                        para eliminar que aún no han sido guardadas.
                    </Typography>
                    <Typography mt={1}>
                        ¿Qué deseas hacer?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 3 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<SaveIcon />}
                        onClick={() => {
                            setAbrirConfirmVolver(false);
                            document.getElementById('btn-guardar-cambios')
                                ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Volver a guardar cambios
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        onClick={() => {
                            setAbrirConfirmVolver(false);
                            navigate('/');
                        }}
                    >
                        Salir sin guardar
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => setAbrirConfirmVolver(false)}
                    >
                        Quedarme aquí
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default Tareas;