CREATE OR REPLACE FUNCTION gestion_proyectos.sp_delete_proyecto(p_id integer)
 RETURNS TABLE(mensaje text, proyecto_id integer, proyecto character varying, tareas_eliminadas bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_proyecto          proyectos%ROWTYPE;
    v_tareas_eliminadas BIGINT;
BEGIN
    -- Validar que el proyecto existe
    SELECT * INTO v_proyecto FROM proyectos WHERE id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El proyecto con id % no existe', p_id;
    END IF;

    -- Contar tareas asociadas antes de eliminar
    SELECT COUNT(t.id) INTO v_tareas_eliminadas
    FROM tareas t
    WHERE t.proyecto_id = p_id;

    -- Eliminar proyecto (CASCADE elimina las tareas automaticamente)
    DELETE FROM proyectos WHERE id = p_id;

    -- Retornar resumen
    RETURN QUERY
    SELECT
        FORMAT(
            'Proyecto "%s" eliminado correctamente junto con %s tarea(s) asociada(s)',
            v_proyecto.nombre,
            v_tareas_eliminadas
        )::TEXT,
        v_proyecto.id,
        v_proyecto.nombre,
        v_tareas_eliminadas;
END;
$function$
