CREATE OR REPLACE FUNCTION gestion_proyectos.sp_update_proyecto(
    p_id            INTEGER,
    p_nombre        VARCHAR  DEFAULT NULL,
    p_descripcion   TEXT     DEFAULT NULL,
    p_prioridad     INTEGER  DEFAULT NULL,
    p_estado        INTEGER  DEFAULT NULL,
    p_fecha_entrega DATE     DEFAULT NULL
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
    v_proyecto      proyectos%ROWTYPE;
    v_prioridad     VARCHAR;
    v_estado        VARCHAR;
    v_total_tareas  BIGINT;
BEGIN
    -- Validar que el proyecto existe
    SELECT * INTO v_proyecto FROM proyectos WHERE id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El proyecto con id % no existe', p_id;
    END IF;

    -- Validar nombre si se envia
    IF p_nombre IS NOT NULL AND TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre del proyecto no puede estar vacio';
    END IF;

    -- Validar prioridad si se envia
    IF p_prioridad IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM prioridades WHERE nivel = p_prioridad
    ) THEN
        RAISE EXCEPTION 'La prioridad % no existe', p_prioridad;
    END IF;

    -- Validar estado si se envia
    IF p_estado IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM estados WHERE codigo = p_estado
    ) THEN
        RAISE EXCEPTION 'El estado % no existe', p_estado;
    END IF;

    -- Validar que fecha entrega no sea menor a hoy
   -- Validar fecha entrega
    IF p_fecha_entrega IS NOT NULL THEN

    -- No puede ser menor a la fecha actual
        IF p_fecha_entrega < CURRENT_DATE THEN RAISE EXCEPTION 'La fecha de entrega no puede ser menor a la fecha actual';

        END IF;

        -- No puede ser menor a la fecha de creacion del proyecto
        IF p_fecha_entrega < v_proyecto.fecha_creacion::DATE THEN RAISE EXCEPTION 'La fecha de entrega no puede ser menor a la fecha de creación del proyecto (%)',
        v_proyecto.fecha_creacion::DATE;

        END IF;

    END IF;

    -- Actualizar solo los campos que se envian, si no se envia conserva el valor actual
    UPDATE proyectos SET
        nombre        = COALESCE(TRIM(p_nombre), nombre),
        descripcion   = COALESCE(p_descripcion,  descripcion),
        prioridad     = COALESCE(p_prioridad,     prioridad),
        estado        = COALESCE(p_estado,        estado),
        fecha_entrega = COALESCE(p_fecha_entrega, fecha_entrega)
                        
    WHERE id = p_id;

    -- Obtener nombres de prioridad y estado actualizados
    SELECT pr.nombre INTO v_prioridad
    FROM prioridades pr
    JOIN proyectos p ON p.prioridad = pr.nivel
    WHERE p.id = p_id;

    SELECT e.nombre INTO v_estado
    FROM estados e
    JOIN proyectos p ON p.estado = e.codigo
    WHERE p.id = p_id;

    -- Contar tareas asociadas
    SELECT COUNT(t.id) INTO v_total_tareas
    FROM tareas t
    WHERE t.proyecto_id = p_id;

    -- Retornar proyecto actualizado
    SELECT * INTO v_proyecto FROM proyectos WHERE id = p_id;

    RETURN QUERY
    SELECT
        v_proyecto.id,
        v_proyecto.nombre,
        v_proyecto.descripcion,
        v_proyecto.fecha_creacion,
        v_proyecto.fecha_entrega,
        v_prioridad,
        v_estado,
        v_total_tareas;
END;
$$;