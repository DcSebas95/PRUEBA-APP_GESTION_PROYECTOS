import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [proyectoActivo, setProyectoActivo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const limpiarError = () => setError(null);

    return (
        <AppContext.Provider value={{
            proyectoActivo,
            setProyectoActivo,
            loading,
            setLoading,
            error,
            setError,
            limpiarError
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);

export default AppContext;