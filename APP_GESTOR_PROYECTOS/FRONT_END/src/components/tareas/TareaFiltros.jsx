import { useState } from 'react';
import {
    Box, TextField, Button, MenuItem,
    Accordion, AccordionSummary, AccordionDetails,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

const estadoOpciones = [
    { codigo: '', nombre: 'Todos' },
    { codigo: 0, nombre: 'Nuevo' },
    { codigo: 1, nombre: 'Activo' },
    { codigo: 2, nombre: 'Finalizado' },
    { codigo: 3, nombre: 'Resuelto' }
];

function TareaFiltros({ onFiltrar }) {
    const [filtros, setFiltros] = useState({
        titulo: '',
        estado: '',
        fecha_creacion_desde: '',
        fecha_creacion_hasta: '',
        fecha_limite_desde: '',
        fecha_limite_hasta: '',
        fecha_entrega_desde: '',
        fecha_entrega_hasta: ''
    });

    const handleChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const handleBuscar = () => {
        // Limpiar campos vacios antes de enviar
        const filtrosLimpios = Object.fromEntries(
            Object.entries(filtros).filter(([_, v]) => v !== '')
        );
        onFiltrar(filtrosLimpios);
    };

    const handleLimpiar = () => {
        setFiltros({
            titulo: '',
            estado: '',
            fecha_creacion_desde: '',
            fecha_creacion_hasta: '',
            fecha_limite_desde: '',
            fecha_limite_hasta: '',
            fecha_entrega_desde: '',
            fecha_entrega_hasta: ''
        });
        onFiltrar({});
    };

    return (
        <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">🔍 Filtros de búsqueda</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>

                    {/* Titulo */}
                    <TextField
                        label="Título"
                        name="titulo"
                        value={filtros.titulo}
                        onChange={handleChange}
                        size="small"
                        sx={{ width: 200 }}
                    />

                    {/* Estado */}
                    <TextField
                        select
                        label="Estado"
                        name="estado"
                        value={filtros.estado}
                        onChange={handleChange}
                        size="small"
                        sx={{ width: 150 }}
                    >
                        {estadoOpciones.map(e => (
                            <MenuItem key={e.codigo} value={e.codigo}>
                                {e.nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Fecha creacion */}
                    <TextField
                        label="Creación desde"
                        name="fecha_creacion_desde"
                        type="date"
                        value={filtros.fecha_creacion_desde}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />
                    <TextField
                        label="Creación hasta"
                        name="fecha_creacion_hasta"
                        type="date"
                        value={filtros.fecha_creacion_hasta}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />

                    {/* Fecha limite */}
                    <TextField
                        label="Límite desde"
                        name="fecha_limite_desde"
                        type="date"
                        value={filtros.fecha_limite_desde}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />
                    <TextField
                        label="Límite hasta"
                        name="fecha_limite_hasta"
                        type="date"
                        value={filtros.fecha_limite_hasta}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />

                    {/* Fecha entrega */}
                    <TextField
                        label="Entrega desde"
                        name="fecha_entrega_desde"
                        type="date"
                        value={filtros.fecha_entrega_desde}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />
                    <TextField
                        label="Entrega hasta"
                        name="fecha_entrega_hasta"
                        type="date"
                        value={filtros.fecha_entrega_hasta}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />

                </Box>

                {/* Botones */}
                <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        startIcon={<CleaningServicesIcon />}
                        onClick={handleLimpiar}
                    >
                        Limpiar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleBuscar}
                    >
                        Buscar
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}

export default TareaFiltros;