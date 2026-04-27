import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import proyectosService from '../services/proyectos.service';
import { useApp } from '../context/AppContext';
import ProyectoCard from '../components/proyectos/ProyectoCard';
import ProyectoForm from '../components/proyectos/ProyectoForm';
import ProyectoFiltros from '../components/proyectos/ProyectoFiltros';

function Proyectos() {
    const navigate = useNavigate();
    const { setProyectoActivo } = useApp();
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [abrirForm, setAbrirForm] = useState(false);
    const [proyectoEditar, setProyectoEditar] = useState(null);
    const [filtros, setFiltros] = useState({});

    const [proyectoEliminar, setProyectoEliminar] = useState(null); //  proyecto a eliminar

    // Cargar proyectos
    const cargarProyectos = async (filtrosActuales = {}) => {
        try {
            setLoading(true);
            setError(null);
            const res = await proyectosService.obtener(filtrosActuales);
            setProyectos(res.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProyectos();
    }, []);

    // Navegar a tareas del proyecto
    const verTareas = (proyecto) => {
        setProyectoActivo(proyecto);
        navigate(`/proyectos/${proyecto.proyecto_id}/tareas`);
    };

    // Abrir formulario para editar
    const editarProyecto = (proyecto) => {
        setProyectoEditar(proyecto);
        setAbrirForm(true);
    };

    // Eliminar proyecto
    // En vez de eliminar directo, abre el dialog
    const confirmarEliminar = (proyecto) => {
        setProyectoEliminar(proyecto);
    };

    // Esta es la que realmente elimina
    const eliminarProyecto = async () => {
        try {
            setLoading(true);
            await proyectosService.eliminar(proyectoEliminar.proyecto_id);
            setProyectoEliminar(null);
            cargarProyectos(filtros);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Guardar proyecto (insert o update)
    const guardarProyecto = async () => {
        await cargarProyectos(filtros); // esperar recarga
        setProyectoEditar(null);
        setAbrirForm(false);
    };

    // Aplicar filtros
    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        cargarProyectos(nuevosFiltros);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Filtros */}

            {/* Encabezado */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" fontWeight="bold">
                    Gestión de Proyectos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { setProyectoEditar(null); setAbrirForm(true); }}
                >
                    Nuevo Proyecto
                </Button>
            </Box>

            <ProyectoFiltros onFiltrar={aplicarFiltros} />

            {/* Error */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            {/* Lista de proyectos */}
            {!loading && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {proyectos.length === 0 ? (
                        <Alert severity="info" sx={{ width: '100%' }}>
                            No hay proyectos registrados
                        </Alert>
                    ) : (
                        proyectos.map(proyecto => (
                            <Box
                                key={proyecto.proyecto_id}
                                sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}
                            >
                                <ProyectoCard
                                    proyecto={proyecto}
                                    onVerTareas={() => verTareas(proyecto)}
                                    onEditar={() => editarProyecto(proyecto)}
                                    onEliminar={() => confirmarEliminar(proyecto)}
                                />
                            </Box>
                        ))
                    )}
                </Box>
            )}

            {/* Formulario crear/editar */}
            <ProyectoForm
                key={proyectoEditar?.proyecto_id || 'nuevo'}
                open={abrirForm}
                proyecto={proyectoEditar}
                onClose={() => {
                    setAbrirForm(false);
                    setProyectoEditar(null);
                }}
                onGuardar={guardarProyecto}
            />

            {/* Dialog confirmacion eliminar proyecto */}
            <Dialog open={Boolean(proyectoEliminar)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    Eliminar Proyecto
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro que deseas eliminar el proyecto{' '}
                        <strong>"{proyectoEliminar?.proyecto}"</strong>?
                    </Typography>
                    <Typography mt={1} color="error">
                        Este proyecto tiene{' '}
                        <strong>{proyectoEliminar?.total_tareas} tarea(s)</strong> asociada(s)
                        que también serán eliminadas.
                    </Typography>
                    <Typography mt={1} variant="body2" color="text.secondary">
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        onClick={() => setProyectoEliminar(null)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={eliminarProyecto}
                    >
                        Sí, eliminar
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default Proyectos;