CREATE OR REPLACE FUNCTION gestion_proyectos.sp_insert_proyecto(
    p_nombre        VARCHAR,
    p_descripcion   TEXT    DEFAULT NULL,
    p_prioridad     INTEGER DEFAULT 3
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
DECLARE
    v_id            INTEGER;
    v_nombre        VARCHAR;
    v_descripcion   TEXT;
    v_fecha_creacion TIMESTAMP;
    v_prioridad     VARCHAR;
    v_estado        VARCHAR;
BEGIN
    -- Validar que el nombre no venga vacio
    IF TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre del proyecto es obligatorio';
    END IF;

    -- Validar que la prioridad existe
    IF NOT EXISTS (SELECT 1 FROM prioridades WHERE nivel = p_prioridad) THEN
        RAISE EXCEPTION 'La prioridad % no existe', p_prioridad;
    END IF;

    -- Insertar y guardar en variables
    INSERT INTO proyectos (nombre, descripcion, prioridad, estado, fecha_creacion, fecha_entrega)
    VALUES (TRIM(p_nombre), p_descripcion, p_prioridad, 0, NOW(), NULL)
    RETURNING
        proyectos.id,
        proyectos.nombre,
        proyectos.descripcion,
        proyectos.fecha_creacion
    INTO v_id, v_nombre, v_descripcion, v_fecha_creacion;

    -- Obtener nombres de prioridad y estado
    SELECT pr.nombre INTO v_prioridad FROM prioridades pr WHERE pr.nivel = p_prioridad;
    SELECT e.nombre  INTO v_estado    FROM estados e    WHERE e.codigo  = 0;

    -- Retornar fila construida manualmente
    RETURN QUERY
    SELECT
        v_id,
        v_nombre,
        v_descripcion,
        v_fecha_creacion,
        NULL::DATE,     -- fecha_entrega siempre NULL al crear
        v_prioridad,
        v_estado,
        0::BIGINT;      -- total_tareas siempre 0 al crear
END;
$$;