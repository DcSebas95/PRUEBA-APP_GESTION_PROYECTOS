import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Proyectos from './pages/Proyectos';
import Tareas from './pages/Tareas';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Proyectos />} />
        <Route path="/proyectos/:id/tareas" element={<Tareas />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;