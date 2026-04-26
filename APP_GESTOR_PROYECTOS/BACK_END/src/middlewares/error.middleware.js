const errorMiddleware = (err, req, res, next) => {
    console.error('❌ Error:', err.message);

    // Errores de PostgreSQL
    if (err.message) {
        return res.status(400).json({
            ok: false,
            mensaje: err.message
        });
    }

    // Error generico
    return res.status(500).json({
        ok: false,
        mensaje: 'Error interno del servidor'
    });
};

module.exports = errorMiddleware;