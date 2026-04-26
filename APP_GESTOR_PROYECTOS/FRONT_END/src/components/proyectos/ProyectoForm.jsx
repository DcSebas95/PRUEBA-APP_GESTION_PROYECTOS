import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Box, Alert
} from '@mui/material';
import proyectosService from '../../services/proyectos.service';

function ProyectoForm({ open, proyecto, onClose, onGuardar }) {
    const [prioridades, setPrioridades] = useState([]);
    const [estados, setEstados] = useState([]);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        prioridad: 1,
        estado: 0,
        fecha_entrega: ''
    });

    // Cargar prioridades y estados para los selects
    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const [resPrioridades, resEstados] = await Promise.all([
                    proyectosService.obtenerPrioridades(),
                    proyectosService.obtenerEstados()
                ]);
                setPrioridades(resPrioridades.data.data);
                setEstados(resEstados.data.data);
            } catch (err) {
                setError(err.message);
            }
        };
        cargarCatalogos();
    }, []);

    // Si viene un proyecto para editar carga sus datos en el form
    useEffect(() => {
        if (!proyecto) return;

        const estadoCodigo =
            estados.find(e => e.nombre === proyecto.proyecto_estado)?.codigo ?? 0;

        const prioridadCodigo =
            prioridades.find(p => p.nombre === proyecto.proyecto_prioridad)?.nivel ?? 1;

        setForm({
            nombre: proyecto.proyecto || '',
            descripcion: proyecto.proyecto_descripcion || '',
            prioridad: prioridadCodigo,
            estado: estadoCodigo,
            fecha_entrega: proyecto.proyecto_fecha_entrega
                ? proyecto.proyecto_fecha_entrega.split('T')[0]
                : ''
        });

    }, [proyecto, estados, prioridades]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'estado') {
            value = Number(value);

            if (value === 0) {
                setForm(prev => ({
                    ...prev,
                    estado: 0,
                    fecha_entrega: ''
                }));
                return;
            }
        }

        if (name === 'prioridad') {
            value = Number(value);
        }

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Guardar proyecto
    const handleGuardar = async () => {
        try {
            setError(null);

            const data = {
                nombre: form.nombre,
                descripcion: form.descripcion || null,
                prioridad: Number(form.prioridad),
                estado: Number(form.estado),
                fecha_entrega: form.fecha_entrega
                    ? form.fecha_entrega
                    : null
            };

            if (proyecto) {
                await proyectosService.actualizar(proyecto.proyecto_id, data);
            } else {
                await proyectosService.insertar(data);
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
                    console.log(res.data.data);
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

                    {/* Estado */}
                    <TextField
                        select
                        label="Estado"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        fullWidth
                        disabled={!proyecto} // ← al crear siempre es Nuevo
                    >
                        {estados.map(e => (
                            <MenuItem key={e.codigo} value={e.codigo}>
                                {e.nombre}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        label="Fecha de Entrega"
                        name="fecha_entrega"
                        type="date"
                        value={form.fecha_entrega}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />


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