CREATE OR REPLACE FUNCTION gestion_proyectos.sp_obtiene_proyectos(
    p_id                    INTEGER   DEFAULT NULL,
    p_nombre                VARCHAR   DEFAULT NULL,
    p_estado                INTEGER   DEFAULT NULL,
    p_prioridad             INTEGER   DEFAULT NULL,
    p_fecha_creacion_desde  TIMESTAMP DEFAULT NULL,
    p_fecha_creacion_hasta  TIMESTAMP DEFAULT NULL,
    p_fecha_entrega_desde   DATE      DEFAULT NULL,
    p_fecha_entrega_hasta   DATE      DEFAULT NULL
)
RETURNS TABLE (
    proyecto_id             INTEGER,
    proyecto                VARCHAR,
    proyecto_descripcion    TEXT,
    proyecto_creado         TIMESTAMP,
    proyecto_fecha_entrega  DATE,
    proyecto_prioridad      VARCHAR,
    proyecto_estado         VARCHAR,
    total_tareas            BIGINT    
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Validar rango fecha creacion
    IF p_fecha_creacion_desde IS NOT NULL AND p_fecha_creacion_hasta IS NOT NULL
       AND p_fecha_creacion_desde > p_fecha_creacion_hasta THEN
        RAISE EXCEPTION 'La fecha de creación desde no puede ser mayor a la fecha hasta';

END IF;

-- Validar rango fecha entrega
IF p_fecha_entrega_desde IS NOT NULL
AND p_fecha_entrega_hasta IS NOT NULL
AND p_fecha_entrega_desde > p_fecha_entrega_hasta THEN RAISE EXCEPTION 'La fecha de entrega desde no puede ser mayor a la fecha hasta';

END IF;

RETURN QUERY
SELECT p.id, p.nombre, p.descripcion, p.fecha_creacion, p.fecha_entrega, pr.nombre, ep.nombre, COUNT(t.id) -- ← cuenta las tareas asociadas
FROM
    proyectos p
    JOIN prioridades pr ON pr.nivel = p.prioridad
    JOIN estados ep ON ep.codigo = p.estado
    LEFT JOIN tareas t ON t.proyecto_id = p.id
WHERE (
        p_id IS NULL
        OR p.id = p_id
    )
    AND (
        p_nombre IS NULL
        OR p.nombre ILIKE '%' || p_nombre || '%'
    )
    AND (
        p_estado IS NULL
        OR p.estado = p_estado
    )
    AND (
        p_prioridad IS NULL
        OR p.prioridad = p_prioridad
    )

-- Logica fecha creacion
AND (
    CASE
        WHEN p_fecha_creacion_desde IS NOT NULL
        AND p_fecha_creacion_hasta IS NOT NULL THEN p.fecha_creacion BETWEEN p_fecha_creacion_desde AND p_fecha_creacion_hasta
        WHEN p_fecha_creacion_desde IS NOT NULL
        AND p_fecha_creacion_hasta IS NULL THEN p.fecha_creacion BETWEEN p_fecha_creacion_desde AND NOW()
        WHEN p_fecha_creacion_desde IS NULL
        AND p_fecha_creacion_hasta IS NOT NULL THEN p.fecha_creacion <= p_fecha_creacion_hasta
        ELSE TRUE
    END
)

-- Logica fecha entrega
AND (
    CASE
        WHEN p_fecha_entrega_desde IS NOT NULL
        AND p_fecha_entrega_hasta IS NOT NULL THEN p.fecha_entrega BETWEEN p_fecha_entrega_desde AND p_fecha_entrega_hasta
        WHEN p_fecha_entrega_desde IS NOT NULL
        AND p_fecha_entrega_hasta IS NULL THEN p.fecha_entrega BETWEEN p_fecha_entrega_desde AND CURRENT_DATE
        WHEN p_fecha_entrega_desde IS NULL
        AND p_fecha_entrega_hasta IS NOT NULL THEN p.fecha_entrega <= p_fecha_entrega_hasta
        ELSE TRUE
    END
)
GROUP BY
    p.id,
    p.nombre,
    p.descripcion,
    p.fecha_creacion,
    p.fecha_entrega,
    pr.nivel, 
    pr.nombre,
    ep.codigo, 
    ep.nombre
ORDER BY pr.nivel ASC, p.id ASC;

END;

$$;