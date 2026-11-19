-- Fase 8 · Prueba de RLS del contenido y el panel (ADM-01, SOP-01, ADM-02, ADM-03, NFR-06).
--
-- Usuarios de prueba: A (normal) y Z (administrador, app_metadata.rol = 'admin').
-- Todo ocurre dentro de una transacción que se deshace al final: no deja datos.
-- Si algo falla, lanza una excepción con el motivo.

begin;

insert into auth.users (id, aud, role, email, raw_app_meta_data)
values
  ('00000000-0000-4000-8000-0000000000a1', 'authenticated', 'authenticated', 'prueba-a@aptiq.test', '{}'),
  ('00000000-0000-4000-8000-0000000000f1', 'authenticated', 'authenticated', 'prueba-admin@aptiq.test', '{"rol":"admin"}');

-- === Verbales: ninguna se publica sin aprobación ===

-- Z (administrador) crea un borrador y una aprobada.
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000f1","role":"authenticated","app_metadata":{"rol":"admin"}}', true);
insert into public.pregunta_verbal (id, tipo, nivel, enunciado, opciones, correcta, explicacion)
values
  ('00000000-0000-4000-8000-00000000b001', 'VER.SINON', 2, 'Borrador de prueba', '["a","b","c","d"]', 0, '{}'),
  ('00000000-0000-4000-8000-00000000b002', 'VER.SINON', 2, 'Aprobada de prueba', '["a","b","c","d"]', 0, '{}');
update public.pregunta_verbal set estado = 'aprobada' where id = '00000000-0000-4000-8000-00000000b002';
do $$
begin
  if (select count(*) from public.pregunta_verbal where enunciado like '% de prueba') <> 2 then
    raise exception 'El administrador no ve todas las verbales';
  end if;
  if (select aprobada_en from public.pregunta_verbal where id = '00000000-0000-4000-8000-00000000b002') is null then
    raise exception 'Aprobar no guarda la fecha de aprobación';
  end if;
end
$$;
-- Editar sube la versión.
update public.pregunta_verbal set enunciado = 'Aprobada de prueba editada' where id = '00000000-0000-4000-8000-00000000b002';
do $$
begin
  if (select version from public.pregunta_verbal where id = '00000000-0000-4000-8000-00000000b002') <> 2 then
    raise exception 'Editar una verbal no sube su versión';
  end if;
end
$$;

-- A (usuario normal) solo ve la aprobada y no puede crear, aprobar ni borrar.
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated","app_metadata":{}}', true);
do $$
declare
  n integer;
begin
  if (select count(*) from public.pregunta_verbal where enunciado like '%de prueba%') <> 1
    or exists (select 1 from public.pregunta_verbal where estado <> 'aprobada') then
    raise exception 'Un usuario normal ve borradores';
  end if;

  update public.pregunta_verbal set estado = 'aprobada' where id = '00000000-0000-4000-8000-00000000b001';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'Un usuario normal aprueba un borrador'; end if;

  delete from public.pregunta_verbal where id = '00000000-0000-4000-8000-00000000b002';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'Un usuario normal borra una verbal'; end if;

  begin
    insert into public.pregunta_verbal (tipo, nivel, estado, enunciado, opciones, correcta, explicacion, aprobada_en)
    values ('VER.SINON', 1, 'aprobada', 'Colada', '["a","b","c","d"]', 0, '{}', now());
    raise exception 'Un usuario normal crea una verbal aprobada';
  exception when insufficient_privilege then
    null;
  end;
end
$$;

-- anon (sin cuenta) solo ve la aprobada.
reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
begin
  if (select count(*) from public.pregunta_verbal where enunciado like '%de prueba%') <> 1
    or exists (select 1 from public.pregunta_verbal where estado <> 'aprobada') then
    raise exception 'anon ve borradores';
  end if;
end
$$;

-- Un usuario que se pone él mismo la marca en user_metadata no es administrador.
reset role;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated","user_metadata":{"rol":"admin"}}', true);
do $$
begin
  if exists (select 1 from public.pregunta_verbal where estado = 'borrador') then
    raise exception 'user_metadata da permisos de administrador';
  end if;
end
$$;

-- === Reportes: la app crea, solo el administrador lee y gestiona ===

reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
insert into public.reporte (id, tipo, nivel, semilla, version, opciones, respuesta, motivo, comentario)
values ('00000000-0000-4000-8000-00000000c001', 'ESP.GIRO', 3, 'abc', '1', 4, 2, 'dos_correctas', 'Prueba');
do $$
begin
  begin
    perform 1 from public.reporte;
    raise exception 'anon lee reportes';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into public.reporte (id, tipo, nivel, semilla, version, opciones, motivo, estado)
    values ('00000000-0000-4000-8000-00000000c002', 'ESP.GIRO', 3, 'abc', '1', 4, 'otro', 'resuelto');
    raise exception 'anon crea un reporte ya resuelto';
  exception when insufficient_privilege then
    null;
  end;
end
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated","app_metadata":{}}', true);
do $$
declare
  n integer;
begin
  if exists (select 1 from public.reporte) then raise exception 'Un usuario normal lee reportes'; end if;
  update public.reporte set estado = 'descartado';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'Un usuario normal cambia un reporte'; end if;
end
$$;

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000f1","role":"authenticated","app_metadata":{"rol":"admin"}}', true);
update public.reporte set estado = 'resuelto', nota = 'Revisado' where id = '00000000-0000-4000-8000-00000000c001';
do $$
begin
  if (select semilla from public.reporte where id = '00000000-0000-4000-8000-00000000c001') <> 'abc'
    or (select estado from public.reporte where id = '00000000-0000-4000-8000-00000000c001') <> 'resuelto' then
    raise exception 'El administrador no ve o no gestiona el reporte con su semilla';
  end if;
end
$$;

-- === Métricas: solo agregados y solo para el administrador ===
-- 4 usuarios con 10 respuestas de NUM.SERIE nivel 2 (familia f, 1.000 ms): aciertan 10, 7, 3 y 0.
-- A mano: acierto 20/40 = 0,5; tiempo 1.000; discriminación = 1,0 (mejor 27 %: 10/10) − 0,0 (peor 27 %: 0/10) = 1.
reset role;
insert into auth.users (id, aud, role, email)
select ('00000000-0000-4000-8000-0000000001' || lpad(k::text, 2, '0'))::uuid, 'authenticated', 'authenticated', 'm' || k || '@aptiq.test'
from generate_series(1, 4) k;
insert into public.sesion (user_id, id, creada, preguntas)
select ('00000000-0000-4000-8000-0000000001' || lpad(k::text, 2, '0'))::uuid, 'm-' || k, now(),
  (select jsonb_agg(jsonb_build_object('type', 'NUM.SERIE', 'level', 2, 'seed', 's' || j, 'answer', 0, 'marked', false,
     'correct', j <= (array[10, 7, 3, 0])[k], 'family', 'f', 'ms', 1000))
   from generate_series(1, 10) j)
from generate_series(1, 4) k;

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000f1","role":"authenticated","app_metadata":{"rol":"admin"}}', true);
do $$
declare
  m record;
begin
  select * into m from public.metricas() where tipo = 'NUM.SERIE' and nivel = 2 and familia = 'f';
  if m.respuestas <> 40 or m.acierto <> 0.5 or m.tiempo_medio_ms <> 1000 or m.discriminacion <> 1 then
    raise exception 'Métricas mal calculadas: % % % %', m.respuestas, m.acierto, m.tiempo_medio_ms, m.discriminacion;
  end if;
  if (select respuestas from public.metricas() where tipo = 'NUM.SERIE' and nivel is null) <> 40 then
    raise exception 'Falta el total por tipo';
  end if;
end
$$;

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated","app_metadata":{}}', true);
do $$
begin
  begin
    perform * from public.metricas();
    raise exception 'Un usuario normal ve las métricas';
  exception when insufficient_privilege then
    null;
  end;
end
$$;

reset role;
set local role anon;
do $$
begin
  begin
    perform * from public.metricas();
    raise exception 'anon ve las métricas';
  exception when insufficient_privilege then
    null;
  end;
end
$$;

-- === Perfiles: públicos, solo el administrador publica versiones nuevas y nunca se editan ===

reset role;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000f1","role":"authenticated","app_metadata":{"rol":"admin"}}', true);
insert into public.perfil_examen (id, version, datos) values ('prueba-perfil', 2, '{"id":"prueba-perfil","version":2}');
do $$
declare
  n integer;
begin
  begin
    insert into public.perfil_examen (id, version, datos) values ('prueba-perfil', 3, '{"id":"otro","version":3}');
    raise exception 'Se publica un perfil con otro id dentro';
  exception when check_violation then
    null;
  end;
  update public.perfil_examen set datos = '{"id":"prueba-perfil","version":2,"x":1}' where id = 'prueba-perfil';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'Se edita una versión publicada'; end if;
exception when insufficient_privilege then
  null; -- esperado: nadie tiene permiso para editar versiones publicadas
end
$$;

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated","app_metadata":{}}', true);
do $$
begin
  begin
    insert into public.perfil_examen (id, version, datos) values ('prueba-perfil', 9, '{"id":"prueba-perfil","version":9}');
    raise exception 'Un usuario normal publica un perfil';
  exception when insufficient_privilege then
    null;
  end;
end
$$;

reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
begin
  if (select count(*) from public.perfil_examen where id = 'prueba-perfil') <> 1 then
    raise exception 'anon no lee los perfiles publicados';
  end if;
end
$$;

reset role;
select 'RLS de la fase 8: OK' as resultado;

rollback;
