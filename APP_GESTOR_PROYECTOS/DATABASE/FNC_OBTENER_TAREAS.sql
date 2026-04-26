CREATE OR REPLACE FUNCTION gestion_proyectos.sp_obtener_tareas(
    p_proyecto_id           INTEGER,
    p_titulo                VARCHAR   DEFAULT NULL,
    p_estado                INTEGER   DEFAULT NULL,
    p_fecha_creacion_desde  TIMESTAMP DEFAULT NULL,
    p_fecha_creacion_hasta  TIMESTAMP DEFAULT NULL,
    p_fecha_limite_desde    DATE      DEFAULT NULL,
    p_fecha_limite_hasta    DATE      DEFAULT NULL,
    p_fecha_entrega_desde   DATE      DEFAULT NULL,
    p_fecha_entrega_hasta   DATE      DEFAULT NULL
)
RETURNS TABLE (
    -- Encabezado de pantalla
    proyecto                VARCHAR,
    -- Tabla de tareas
    tarea_id                INTEGER,
    tarea                   VARCHAR,
    tarea_descripcion       TEXT,
    tarea_creada            TIMESTAMP,
    tarea_fecha_limite      DATE,
    tarea_fecha_entrega     DATE,
    tarea_estado            VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Validar que el proyecto existe
    IF NOT EXISTS (SELECT 1 FROM proyectos WHERE id = p_proyecto_id) THEN
        RAISE EXCEPTION 'El proyecto con id % no existe', p_proyecto_id;
    END IF;

    -- Validar rango fecha creacion
    IF p_fecha_creacion_desde IS NOT NULL AND p_fecha_creacion_hasta IS NOT NULL
       AND p_fecha_creacion_desde > p_fecha_creacion_hasta THEN
        RAISE EXCEPTION 'La fecha de creación desde no puede ser mayor a la fecha hasta';
    END IF;

    -- Validar rango fecha limite
    IF p_fecha_limite_desde IS NOT NULL AND p_fecha_limite_hasta IS NOT NULL
       AND p_fecha_limite_desde > p_fecha_limite_hasta THEN
        RAISE EXCEPTION 'La fecha límite desde no puede ser mayor a la fecha hasta';
    END IF;

    -- Validar rango fecha entrega
    IF p_fecha_entrega_desde IS NOT NULL AND p_fecha_entrega_hasta IS NOT NULL
       AND p_fecha_entrega_desde > p_fecha_entrega_hasta THEN
        RAISE EXCEPTION 'La fecha de entrega desde no puede ser mayor a la fecha hasta';
    END IF;

    RETURN QUERY
    SELECT
        p.nombre,       -- nombre del proyecto para el encabezado
        t.id,
        t.titulo,
        t.descripcion,
        t.fecha_creacion,
        t.fecha_limite,
        t.fecha_entrega,
        et.nombre
    FROM tareas t
    JOIN proyectos p  ON p.id      = t.proyecto_id
    JOIN estados et   ON et.codigo = t.estado
    WHERE
        t.proyecto_id = p_proyecto_id
    AND (p_titulo IS NULL OR t.titulo ILIKE '%' || p_titulo || '%')
    AND (p_estado IS NULL OR t.estado = p_estado)

    -- Logica fecha creacion
    AND (
        CASE
            WHEN p_fecha_creacion_desde IS NOT NULL AND p_fecha_creacion_hasta IS NOT NULL
                THEN t.fecha_creacion BETWEEN p_fecha_creacion_desde AND p_fecha_creacion_hasta
            WHEN p_fecha_creacion_desde IS NOT NULL AND p_fecha_creacion_hasta IS NULL
                THEN t.fecha_creacion >= p_fecha_creacion_desde
            WHEN p_fecha_creacion_desde IS NULL AND p_fecha_creacion_hasta IS NOT NULL
                THEN t.fecha_creacion <= p_fecha_creacion_hasta
            ELSE TRUE
        END
    )

    -- Logica fecha limite
    AND (
        CASE
            WHEN p_fecha_limite_desde IS NOT NULL AND p_fecha_limite_hasta IS NOT NULL
                THEN t.fecha_limite BETWEEN p_fecha_limite_desde AND p_fecha_limite_hasta
            WHEN p_fecha_limite_desde IS NOT NULL AND p_fecha_limite_hasta IS NULL
                THEN t.fecha_limite >= p_fecha_limite_desde
            WHEN p_fecha_limite_desde IS NULL AND p_fecha_limite_hasta IS NOT NULL
                THEN t.fecha_limite <= p_fecha_limite_hasta
            ELSE TRUE
        END
    )

    -- Logica fecha entrega
    AND (
        CASE
            WHEN p_fecha_entrega_desde IS NOT NULL AND p_fecha_entrega_hasta IS NOT NULL
                THEN t.fecha_entrega BETWEEN p_fecha_entrega_desde AND p_fecha_entrega_hasta
            WHEN p_fecha_entrega_desde IS NOT NULL AND p_fecha_entrega_hasta IS NULL
                THEN t.fecha_entrega >= p_fecha_entrega_desde
            WHEN p_fecha_entrega_desde IS NULL AND p_fecha_entrega_hasta IS NOT NULL
                THEN t.fecha_entrega <= p_fecha_entrega_hasta
            ELSE TRUE
        END
    )

    ORDER BY t.id ASC;
END;
$$;

