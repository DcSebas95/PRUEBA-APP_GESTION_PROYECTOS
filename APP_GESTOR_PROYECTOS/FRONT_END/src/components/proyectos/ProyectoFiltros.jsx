import { useState } from 'react';
import {
    Box, TextField, Button,
    Accordion, AccordionSummary, AccordionDetails,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

function ProyectoFiltros({ onFiltrar }) {
    const [filtros, setFiltros] = useState({
        id: '',
        nombre: ''
    });

    const handleChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const handleBuscar = () => {
        const filtrosLimpios = Object.fromEntries(
            Object.entries(filtros).filter(([_, v]) => v !== '')
        );
        onFiltrar(filtrosLimpios);
    };

    const handleLimpiar = () => {
        setFiltros({ id: '', nombre: '' });
        onFiltrar({});
    };

    return (
        <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">🔍 Filtros de búsqueda</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>

                    {/* ID */}
                    <TextField
                        label="ID Proyecto"
                        name="id"
                        type="number"
                        value={filtros.id}
                        onChange={handleChange}
                        size="small"
                        sx={{ width: 130 }}
                    />

                    {/* Nombre */}
                    <TextField
                        label="Nombre Proyecto"
                        name="nombre"
                        value={filtros.nombre}
                        onChange={handleChange}
                        size="small"
                        sx={{ width: 250 }}
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

export default ProyectoFiltros;