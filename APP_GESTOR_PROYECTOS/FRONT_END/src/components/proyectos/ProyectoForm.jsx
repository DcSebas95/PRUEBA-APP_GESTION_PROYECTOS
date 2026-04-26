import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Box, Alert
} from '@mui/material';
import proyectosService from '../../services/proyectos.service';

function ProyectoForm({ open, proyecto, onClose, onGuardar }) {
    const [prioridades, setPrioridades] = useState([]);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        prioridad: 1
    });

    // Cargar prioridades para el select
    useEffect(() => {
        const cargarPrioridades = async () => {
            try {
                const res = await proyectosService.obtenerPrioridades();
                setPrioridades(res.data.data);
            } catch (err) {
                setError(err.message);
            }
        };
        cargarPrioridades();
    }, []);

    // Si viene un proyecto para editar carga sus datos en el form
    useEffect(() => {
        if (proyecto) {
            setForm({
                nombre: proyecto.proyecto || '',
                descripcion: proyecto.proyecto_descripcion || '',
                prioridad: proyecto.proyecto_prioridad === 'Alta' ? 1 :
                    proyecto.proyecto_prioridad === 'Media' ? 2 : 3
            });
        } else {
            setForm({ nombre: '', descripcion: '', prioridad: 1 });
        }
        setError(null);
    }, [proyecto, open]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Guardar proyecto
    const handleGuardar = async () => {
        try {
            setError(null);
            if (proyecto) {
                // Actualizar
                await proyectosService.actualizar(proyecto.proyecto_id, form);
            } else {
                // Insertar
                await proyectosService.insertar(form);
            }
            onGuardar();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* Nombre */}
                    <TextField
                        label="Nombre *"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        fullWidth
                        autoFocus
                    />

                    {/* Descripcion */}
                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />

                    {/* Prioridad */}
                    <TextField
                        select
                        label="Prioridad"
                        name="prioridad"
                        value={form.prioridad}
                        onChange={handleChange}
                        fullWidth
                    >
                        {prioridades.map(p => (
                            <MenuItem key={p.nivel} value={p.nivel}>
                                {p.nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} variant="contained">
                    {proyecto ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProyectoForm;