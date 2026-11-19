-- Fase 8 · T14 · Métricas por pregunta y tipo para el panel (ADM-02).
--
-- Devuelve solo agregados: por tipo; por tipo, nivel y familia de reglas; y por cada verbal del
-- banco. El panel nunca lee las respuestas de cada persona.
--   * acierto: aciertos ÷ respuestas (en blanco cuenta como no acertada);
--   * tiempo_medio_ms: media del tiempo de respuesta, si se guardó;
--   * discriminacion: acierto del 27 % de usuarios con mejor acierto global menos el del 27 % con
--     peor (índice de discriminación clásico). Con menos de 30 respuestas, null («pocos datos»).
-- Solo cuentan las preguntas guardadas con `correct` (desde la fase 6).

create or replace function public.metricas()
returns table (
  tipo text,
  nivel integer,
  familia text,
  pregunta text,
  respuestas bigint,
  acierto numeric,
  tiempo_medio_ms numeric,
  discriminacion numeric
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not private.es_admin() then
    raise exception 'Solo para administradores' using errcode = '42501';
  end if;
  return query
  with resp as (
    select s.user_id, q from public.sesion s, jsonb_array_elements(s.preguntas) q
    union all
    select i.user_id, q from public.intento_simulacro i, jsonb_array_elements(i.preguntas) q
  ),
  r as (
    select
      user_id,
      q ->> 'type' as tipo,
      (q ->> 'level')::integer as nivel,
      coalesce(q ->> 'family', '') as familia,
      case when q ->> 'type' in ('VER.SINON', 'VER.ANALOG') then split_part(q ->> 'seed', '~', 1) end as pregunta,
      (q ->> 'correct')::boolean as ok,
      (q ->> 'ms')::numeric as ms
    from resp
    where q ? 'correct'
  ),
  u as (
    select user_id, percent_rank() over (order by avg(ok::integer)) as pr
    from r
    group by user_id
  ),
  g as (
    select r.*, u.pr from r join u using (user_id)
  )
  select
    g.tipo,
    g.nivel,
    g.familia,
    g.pregunta,
    count(*),
    round(avg(g.ok::integer), 3),
    round(avg(g.ms)),
    case
      when count(*) >= 30
        and count(*) filter (where g.pr >= 0.73) > 0
        and count(*) filter (where g.pr <= 0.27) > 0
      then round(
        avg(g.ok::integer) filter (where g.pr >= 0.73) - avg(g.ok::integer) filter (where g.pr <= 0.27), 3)
    end
  from g
  group by grouping sets ((g.tipo), (g.tipo, g.nivel, g.familia), (g.tipo, g.pregunta))
  having grouping(g.pregunta) = 1 or g.pregunta is not null
  order by 1, 2 nulls first, 3 nulls first, 4 nulls first;
end;
$$;

revoke all on function public.metricas() from public, anon;
grant execute on function public.metricas() to authenticated;
