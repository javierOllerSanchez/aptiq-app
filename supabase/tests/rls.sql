-- Fase 5 · T2 · Prueba de RLS y borrado en cascada (NFR-06, SOP-02).
--
-- Crea dos usuarios de prueba dentro de una transacción, comprueba que B no ve ni toca
-- nada de A, que anon no tiene acceso y que borrar a A borra todas sus filas.
-- Todo se deshace al final (rollback): no deja datos en el proyecto.
-- Si algo falla, lanza una excepción con el motivo.

begin;

insert into auth.users (id, aud, role, email)
values
  ('00000000-0000-4000-8000-00000000000a', 'authenticated', 'authenticated', 'prueba-a@aptiq.test'),
  ('00000000-0000-4000-8000-00000000000b', 'authenticated', 'authenticated', 'prueba-b@aptiq.test');

-- Usuario A guarda un dato en cada tabla.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);

insert into public.ajuste (clave, valor) values ('oposicion', 'guardia-civil-2026');
insert into public.semilla_usada (semilla) values ('NUM.SERIE:1:abc');
insert into public.sesion (id, creada, preguntas) values ('s-1', now(), '[]');
insert into public.intento_simulacro (id, empezado, duracion_ms, fin, preguntas)
values ('i-1', now() - interval '55 minutes', 3300000, now(), '[]');

do $$
begin
  if (select count(*) from public.ajuste) <> 1
    or (select count(*) from public.semilla_usada) <> 1
    or (select count(*) from public.sesion) <> 1
    or (select count(*) from public.intento_simulacro) <> 1 then
    raise exception 'A no ve sus propias filas';
  end if;
end
$$;

-- Usuario B no ve, no cambia, no borra y no crea nada a nombre de A.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000b","role":"authenticated"}', true);

do $$
declare
  n integer;
begin
  if (select count(*) from public.ajuste) + (select count(*) from public.semilla_usada)
    + (select count(*) from public.sesion) + (select count(*) from public.intento_simulacro) <> 0 then
    raise exception 'B ve filas de A';
  end if;

  update public.ajuste set valor = 'otra' where clave = 'oposicion';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'B cambia un ajuste de A'; end if;

  delete from public.sesion where id = 's-1';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'B borra una sesión de A'; end if;

  begin
    insert into public.sesion (user_id, id, creada, preguntas)
    values ('00000000-0000-4000-8000-00000000000a', 's-falsa', now(), '[]');
    raise exception 'B crea una sesión a nombre de A';
  exception when insufficient_privilege then
    null; -- esperado: la política with check lo impide
  end;
end
$$;

-- anon (sin sesión) no tiene ningún permiso.
reset role;
set local role anon;
do $$
begin
  begin
    perform 1 from public.sesion;
    raise exception 'anon lee la tabla sesion';
  exception when insufficient_privilege then
    null;
  end;
end
$$;

-- Borrar la cuenta de A borra todas sus filas (SOP-02).
reset role;
delete from auth.users where id = '00000000-0000-4000-8000-00000000000a';
do $$
begin
  if exists (select 1 from public.ajuste where user_id = '00000000-0000-4000-8000-00000000000a')
    or exists (select 1 from public.semilla_usada where user_id = '00000000-0000-4000-8000-00000000000a')
    or exists (select 1 from public.sesion where user_id = '00000000-0000-4000-8000-00000000000a')
    or exists (select 1 from public.intento_simulacro where user_id = '00000000-0000-4000-8000-00000000000a') then
    raise exception 'Quedan filas de A tras borrar la cuenta';
  end if;
end
$$;

select 'RLS y borrado en cascada: OK' as resultado;

rollback;
