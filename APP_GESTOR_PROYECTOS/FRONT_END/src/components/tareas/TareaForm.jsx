import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Box, Alert
} from '@mui/material';
import tareasService from '../../services/tareas.service';

function TareaForm({ open, tarea, proyectoId, onClose, onGuardar, onActualizarLocal }) {
    const [estados, setEstados] = useState([]);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        estado: 0,        // codigo numerico
        fecha_limite: '',
        fecha_entrega: ''
    });

    // Cargar estados para el select
    useEffect(() => {
        const cargarEstados = async () => {
            try {
                const res = await tareasService.obtenerEstados(); // ← usar tareasService
                setEstados(res.data.data);
            } catch (err) {
                setError(err.message);
            }
        };
        if (open) cargarEstados();
    }, [open]);

    // Cargar datos de la tarea para editar
    useEffect(() => {
        if (!tarea) {
            setForm({
                titulo: '',
                descripcion: '',
                estado: 0,
                fecha_limite: '',
                fecha_entrega: ''
            });
            return;
        }

        // El backend devuelve tarea_estado como string en minuscula: "nuevo", "activo", etc.
        // Buscar el codigo correspondiente en el array de estados
        const estadoEncontrado = estados.find(e => e.nombre === tarea.tarea_estado);
        const estadoCodigo = estadoEncontrado ? estadoEncontrado.codigo : 0;

        setForm({
            titulo: tarea.tarea || '',
            descripcion: tarea.tarea_descripcion || '',
            estado: estadoCodigo,
            fecha_limite: tarea.tarea_fecha_limite ? tarea.tarea_fecha_limite.split('T')[0] : '',
            fecha_entrega: tarea.tarea_fecha_entrega ? tarea.tarea_fecha_entrega.split('T')[0] : ''
        });
    }, [tarea, estados]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'estado' && Number(value) === 0) {
            // Si el nuevo estado es "nuevo" (codigo 0), limpiar fecha entrega
            setForm(prev => ({
                ...prev,
                estado: 0,
                fecha_entrega: ''
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // Busca esta funcion en TareaForm.jsx (linea ~70)
    const handleGuardar = async () => {
        try {
            setError(null);

            if (!form.titulo.trim()) {
                setError('El título de la tarea es obligatorio');
                return;
            }

            const estadoMapping = {
                0: 'nuevo',
                1: 'activo',
                2: 'finalizado',
                3: 'resuelto'
            };

            const data = {
                titulo: form.titulo.trim(),
                descripcion: form.descripcion || null,
                estado: Number(form.estado),
                estado_nombre: estadoMapping[Number(form.estado)],
                fecha_limite: form.fecha_limite || null,
                fecha_entrega: form.estado === 0 ? null : (form.fecha_entrega || null)
            };

            if (tarea) {
                // Edicion: actualizar localmente
                if (onActualizarLocal) {
                    onActualizarLocal(tarea.tarea_id, {
                        tarea: data.titulo,
                        tarea_descripcion: data.descripcion,
                        tarea_estado: data.estado_nombre,
                        tarea_fecha_limite: data.fecha_limite,
                        tarea_fecha_entrega: data.fecha_entrega
                    });
                }
                onClose();
            } else {
                // CREAR NUEVA: solo localmente, NO guardar en BD aun
                if (onActualizarLocal) {
                    // Generar ID temporal negativo para identificar nuevas tareas
                    const tempId = -Date.now(); // Usar positivo, pero con un flag _esNueva

                    onActualizarLocal(tempId, {
                        tarea_id: tempId,
                        tarea: data.titulo,
                        tarea_descripcion: data.descripcion,
                        tarea_estado: data.estado_nombre,
                        tarea_fecha_limite: data.fecha_limite,
                        tarea_fecha_entrega: data.fecha_entrega,
                        tarea_creada: new Date().toISOString(),
                        _esNueva: true  // Marcar como nueva tarea
                    }, true); // true = es nueva tarea
                }
                onClose();
            }
        } catch (err) {
            console.error('Error en guardar:', err);
            setError(err.response?.data?.message || err.message);
        }
    };

    // Funcion para capitalizar primera letra (para mostrar en el select)
    const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

                    <TextField
                        label="Título *"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        fullWidth
                        autoFocus
                    />

                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />

                    {/* Select de estado - visible solo al editar */}
                    {tarea && (
                        <TextField
                            select
                            label="Estado"
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            fullWidth
                        >
                            {estados.map(e => (
                                <MenuItem key={e.codigo} value={e.codigo}>
                                    {capitalizar(e.nombre)}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <TextField
                        label="Fecha Límite"
                        name="fecha_limite"
                        type="date"
                        value={form.fecha_limite}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Fecha de Entrega"
                        name="fecha_entrega"
                        type="date"
                        value={form.fecha_entrega}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        disabled={form.estado === 0}
                        helperText={form.estado === 0 ? "Las tareas nuevas no tienen fecha de entrega" : ""}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button onClick={handleGuardar} variant="contained">
                    {tarea ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TareaForm;