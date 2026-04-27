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

// Mapeo de nombres de estado a codigos (para guardar en BD)
const MAPEO_ESTADOS = {
    'nuevo': 0,
    'activo': 1,
    'finalizado': 2,
    'resuelto': 3
};

function Tareas() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { proyectoActivo } = useApp();

    // Estados principales
    const [tareas, setTareas] = useState([]);
    const [tareasOriginales, setTareasOriginales] = useState([]); // Copia limpia del backend
    const [totalTareas, setTotalTareas] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [abrirForm, setAbrirForm] = useState(false);
    const [tareaEditar, setTareaEditar] = useState(null);
    const [filtros, setFiltros] = useState({});

    // Estados para cambios pendientes
    const [pendientes, setPendientes] = useState([]);             // IDs para eliminar
    const [tareasEditadas, setTareasEditadas] = useState({});     // { id: datos_modificados }
    const [abrirConfirmVolver, setAbrirConfirmVolver] = useState(false);

    // Paginacion
    const [pagina, setPagina] = useState(0);
    const [filasPorPagina, setFilasPorPagina] = useState(5);

    // Calcular si hay cambios automaticamente
    const hayCambios = pendientes.length > 0 || Object.keys(tareasEditadas).length > 0;

    // Cargar tareas desde el backend
    const cargarTareas = async (filtrosActuales = {}) => {
        try {
            setLoading(true);
            setError(null);

            const res = await tareasService.obtener(id, filtrosActuales);
            const datos = res.data.data;

            // Guardar tanto la version de trabajo como la original
            setTareas(datos);
            setTareasOriginales(JSON.parse(JSON.stringify(datos))); // Copia profunda
            setTareasEditadas({});                                   // Limpiar ediciones
            setPendientes([]);                                       // Limpiar eliminaciones
            setPagina(0);

            if (Object.keys(filtrosActuales).length === 0) {
                setTotalTareas(res.data.total);
            }
        } catch (err) {
            console.error("Error cargando tareas:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTareas();
    }, [id]);

    // ACTUALIZAR TAREA LOCALMENTE (no guarda en BD)
    const actualizarTareaLocal = (tareaId, nuevosDatos, esNueva = false) => {
        if (esNueva) {
            // Agregar nueva tarea a la lista
            setTareas(prev => {
                // Evitar duplicados por ID temporal
                const existe = prev.some(t => t.tarea_id === tareaId);
                if (existe) return prev;
                return [nuevosDatos, ...prev];
            });

            // Registrar como nueva tarea pendiente
            setTareasEditadas(prev => ({
                ...prev,
                [tareaId]: nuevosDatos
            }));
        } else {
            // Actualizar tarea existente
            setTareas(prev =>
                prev.map(t =>
                    t.tarea_id === tareaId ? { ...t, ...nuevosDatos } : t
                )
            );

            setTareasEditadas(prev => ({
                ...prev,
                [tareaId]: { ...prev[tareaId], ...nuevosDatos }
            }));
        }
    };

    //  MARCAR/DESMARCAR PARA ELIMINAR
    const marcarEliminar = (tareaId) => {
        setPendientes(prev => {
            const existe = prev.includes(tareaId);
            return existe
                ? prev.filter(i => i !== tareaId)
                : [...prev, tareaId];
        });
    };

    //  CANCELAR TODO (eliminaciones + ediciones)
    const cancelarTodo = () => {
        // Restaurar solo tareas originales (sin las nuevas no guardadas)
        setTareas(JSON.parse(JSON.stringify(tareasOriginales)));
        setTareasEditadas({});
        setPendientes([]);
    };
    //  GUARDAR CAMBIOS (eliminaciones + ediciones)
    const guardarCambios = async () => {
        if (!hayCambios) return;

        try {
            setLoading(true);

            const promesas = [];

            // 1. Eliminaciones pendientes
            pendientes.forEach(tareaId => {
                // Solo eliminar si es una tarea real (ID positivo)
                if (tareaId > 0) {
                    promesas.push(tareasService.eliminar(id, tareaId));
                }
            });

            // 2. Ediciones pendientes (tareas existentes modificadas)
            Object.entries(tareasEditadas).forEach(([tareaId, datos]) => {
                const idNumerico = parseInt(tareaId);

                // Si es tarea nueva (ID negativo o tiene flag _esNueva)
                if (idNumerico < 0 || datos._esNueva) {
                    // Crear nueva tarea en BD
                    debugger;
                    const codigoEstado = MAPEO_ESTADOS[datos.tarea_estado?.toLowerCase()] ?? 0;
                    promesas.push(
                        tareasService.insertar(id, {
                            titulo: datos.tarea,
                            descripcion: datos.tarea_descripcion,
                            estado: codigoEstado,
                            fecha_limite: datos.tarea_fecha_limite || null
                        })
                    );
                } else {
                    debugger;
                    // Actualizar tarea existente
                    const codigoEstado = MAPEO_ESTADOS[datos.tarea_estado?.toLowerCase()] ?? null;
                    if (codigoEstado !== null || datos.tarea || datos.tarea_descripcion || datos.tarea_fecha_limite) {
                        promesas.push(
                            tareasService.actualizar(id, tareaId, {
                                titulo: datos.tarea,
                                descripcion: datos.tarea_descripcion,
                                estado: codigoEstado,
                                fecha_limite: datos.tarea_fecha_limite || null,
                                fecha_entrega: datos.tarea_fecha_entrega || null
                            })
                        );
                    }
                }
            });

            // Ejecutar todas las operaciones
            await Promise.all(promesas);

            // Recargar desde el backend
            await cargarTareas(filtros);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Editar tarea (abre el formulario)
    const editarTarea = (tarea) => {
        setTareaEditar(tarea);
        setAbrirForm(true);
    };

    // Callback cuando se cierra el formulario
    const cerrarFormulario = () => {
        setAbrirForm(false);
        setTareaEditar(null);
    };

    // Guardar tarea NUEVA desde formulario (creacion directa)
    const guardarTareaNueva = async () => {
        await cargarTareas(filtros);
        cerrarFormulario();
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

    // Tareas de la pagina actual
    const tareasPaginadas = tareas.slice(
        pagina * filasPorPagina,
        pagina * filasPorPagina + filasPorPagina
    );

    // Manejar click en volver
    const handleVolver = () => {
        if (hayCambios) {
            setAbrirConfirmVolver(true);
        } else {
            navigate('/');
        }
    };

    // Contar ediciones pendientes (separando nuevas de editadas)
    const totalNuevas = Object.values(tareasEditadas).filter(t => t._esNueva === true).length;
    const totalEditadas = Object.keys(tareasEditadas).length - totalNuevas;

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
                            {totalTareas} tarea(s) en total
                            {tareas.length !== totalTareas && (
                                <span style={{ color: '#1976d2', marginLeft: 8 }}>
                                    · {tareas.length} resultado(s) filtrado(s)
                                </span>
                            )}
                            {pendientes.length > 0 && (
                                <span style={{ color: '#d32f2f', marginLeft: 8 }}>
                                    · {pendientes.length} marcada(s) para eliminar
                                </span>
                            )}
                            {totalNuevas > 0 && (
                                <span style={{ color: '#4caf50', marginLeft: 8 }}>
                                    · {totalNuevas} tarea(s) nueva(s)
                                </span>
                            )}
                            {totalEditadas > 0 && (
                                <span style={{ color: '#ed6c02', marginLeft: 8 }}>
                                    · {totalEditadas} tarea(s) editada(s)
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
                                            <Alert severity="info">Sin resultados</Alert>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tareasPaginadas.map(tarea => {
                                        const marcada = pendientes.includes(tarea.tarea_id);
                                        const editada = tareasEditadas.hasOwnProperty(tarea.tarea_id);

                                        return (
                                            <TableRow
                                                key={tarea.tarea_id}
                                                hover
                                                sx={{
                                                    backgroundColor: marcada ? '#ffebee' :
                                                        tarea._esNueva ? '#e8f5e9' :  // Verde claro para nuevas
                                                            editada ? '#fff3e0' : 'inherit',
                                                    opacity: marcada ? 0.6 : 1,
                                                    '&:last-child td': { border: 0 }
                                                }}
                                            >
                                                <TableCell>
                                                    {tarea.tarea_id > 0 ? (
                                                        tarea.tarea_id
                                                    ) : (
                                                        <Typography variant="caption" color="success.main" fontWeight="bold">
                                                            Nueva
                                                        </Typography>
                                                    )}
                                                    {tarea._esNueva && (
                                                        <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                                                            (pendiente)
                                                        </Typography>
                                                    )}
                                                    {!tarea._esNueva && editada && !marcada && (
                                                        <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                                                            (editada)
                                                        </Typography>
                                                    )}
                                                </TableCell>
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
                            onClick={cancelarTodo}
                            disabled={!hayCambios}
                        >
                            Cancelar
                        </Button>
                        <Button
                            id="btn-guardar-cambios"
                            variant="contained"
                            color="error"
                            startIcon={<SaveIcon />}
                            onClick={guardarCambios}
                            disabled={!hayCambios}
                        >
                            Guardar cambios
                            {hayCambios && ` (${pendientes.length + totalNuevas + totalEditadas})`}
                        </Button>
                    </Box>
                </>
            )}

            {/* Formulario crear/editar */}
            {/* Formulario crear/editar */}
            <TareaForm
                open={abrirForm}
                tarea={tareaEditar}
                proyectoId={id}
                onClose={cerrarFormulario}
                onGuardar={guardarTareaNueva}
                onActualizarLocal={actualizarTareaLocal}
            />

            {/* Dialog confirmacion volver */}
            <Dialog open={abrirConfirmVolver} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    Cambios pendientes
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Tienes cambios sin guardar:
                    </Typography>
                    {pendientes.length > 0 && (
                        <Typography mt={1}>
                            • <strong>{pendientes.length} tarea(s)</strong> marcadas para eliminar
                        </Typography>
                    )}
                    {totalNuevas > 0 && (
                        <Typography mt={1}>
                            • <strong>{totalNuevas} tarea(s)</strong> nuevas
                        </Typography>
                    )}
                    {totalEditadas > 0 && (
                        <Typography mt={1}>
                            • <strong>{totalEditadas} tarea(s)</strong> editadas
                        </Typography>
                    )}
                    <Typography mt={2}>¿Que deseas hacer?</Typography>
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