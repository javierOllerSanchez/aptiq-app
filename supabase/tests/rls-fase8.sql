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

reset role;
select 'RLS de la fase 8: OK' as resultado;

rollback;
