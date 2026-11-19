-- Fase 8 · cierre (revisor-contenido): índice de discriminación mejor definido.
--   * Grupos extremos por percentil del acierto global (p27 y p73), con los empates dentro: con
--     percent_rank los empatados arriba quedaban fuera del grupo alto.
--   * Solo cuentan para ordenar los usuarios con 5 respuestas o más.
--   * Hacen falta 30 respuestas en total y 10 en cada grupo extremo; si no, null («pocos datos»).
--   * Datos escritos por el cliente: se ignoran los valores que no tienen el formato esperado en
--     lugar de romper la función entera.

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
      case when q ->> 'ms' ~ '^[0-9]{1,9}(\.[0-9]+)?$' then (q ->> 'ms')::numeric end as ms
    from resp
    where jsonb_typeof(q -> 'correct') = 'boolean'
      and q ->> 'level' ~ '^[1-5]$'
      and jsonb_typeof(q -> 'type') = 'string'
  ),
  u as (
    select user_id, avg(ok::integer) as global
    from r
    group by user_id
    having count(*) >= 5
  ),
  corte as (
    select
      percentile_cont(0.27) within group (order by global) as bajo,
      percentile_cont(0.73) within group (order by global) as alto
    from u
  ),
  g as (
    select
      r.*,
      case when u.global >= c.alto then 'alto' when u.global <= c.bajo then 'bajo' end as grupo
    from r
    left join u using (user_id)
    cross join corte c
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
        and count(*) filter (where g.grupo = 'alto') >= 10
        and count(*) filter (where g.grupo = 'bajo') >= 10
      then round(
        avg(g.ok::integer) filter (where g.grupo = 'alto') - avg(g.ok::integer) filter (where g.grupo = 'bajo'), 3)
    end
  from g
  group by grouping sets ((g.tipo), (g.tipo, g.nivel, g.familia), (g.tipo, g.pregunta))
  having grouping(g.pregunta) = 1 or g.pregunta is not null
  order by 1, 2 nulls first, 3 nulls first, 4 nulls first;
end;
$$;

revoke all on function public.metricas() from public, anon;
grant execute on function public.metricas() to authenticated;
