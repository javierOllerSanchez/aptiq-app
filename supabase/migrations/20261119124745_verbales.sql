-- Fase 8 · T7 · Banco de preguntas verbales con aprobación (ADM-01; criterio de aceptación:
-- «ninguna verbal se publica sin aprobación»).
--
-- Las verbales no se generan por código: se redactan, nacen en estado «borrador» y solo una
-- persona administradora las aprueba en el panel. La base de datos solo deja leer las aprobadas
-- a la app (anon y usuarios), así que un borrador no puede llegar nunca a un móvil.
--
-- Administrador: usuario con app_metadata.rol = 'admin'. app_metadata solo lo puede cambiar la
-- clave de servicio (nunca el propio usuario), y viaja firmado en el token.

create schema if not exists private;

create or replace function private.es_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin', false);
$$;

revoke all on function private.es_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.es_admin() to anon, authenticated;

create table public.pregunta_verbal (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('VER.SINON', 'VER.ANALOG')),
  nivel smallint not null check (nivel between 1 and 5),
  estado text not null default 'borrador' check (estado in ('borrador', 'aprobada', 'rechazada')),
  -- Sube con cada edición: un reporte guarda la versión que vio la persona.
  version integer not null default 1 check (version >= 1),
  enunciado text not null check (char_length(enunciado) between 1 and 300),
  opciones jsonb not null check (jsonb_typeof(opciones) = 'array' and jsonb_array_length(opciones) = 4),
  correcta smallint not null check (correcta between 0 and 3),
  explicacion jsonb not null check (jsonb_typeof(explicacion) = 'object'),
  -- Quién la redactó: «ia» (borrador de Claude) o «persona».
  autoria text not null default 'ia' check (autoria in ('ia', 'persona')),
  aprobada_en timestamptz,
  creada timestamptz not null default now(),
  actualizada timestamptz not null default now(),
  -- Una aprobada siempre tiene fecha de aprobación.
  check (estado <> 'aprobada' or aprobada_en is not null)
);

-- La app solo pide las aprobadas.
create index pregunta_verbal_aprobadas_idx on public.pregunta_verbal (tipo) where estado = 'aprobada';

-- Cada edición sube la versión y la fecha; aprobar pone la fecha de aprobación.
create or replace function private.pregunta_verbal_cambio()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.enunciado, new.opciones, new.correcta, new.explicacion, new.nivel)
     is distinct from (old.enunciado, old.opciones, old.correcta, old.explicacion, old.nivel) then
    new.version := old.version + 1;
  end if;
  if new.estado = 'aprobada' and old.estado <> 'aprobada' then
    new.aprobada_en := now();
  end if;
  new.actualizada := now();
  return new;
end;
$$;

create trigger pregunta_verbal_cambio
before update on public.pregunta_verbal
for each row execute function private.pregunta_verbal_cambio();

alter table public.pregunta_verbal enable row level security;
alter table public.pregunta_verbal force row level security;
revoke all on public.pregunta_verbal from anon, authenticated;
grant select on public.pregunta_verbal to anon, authenticated;
grant insert, update, delete on public.pregunta_verbal to authenticated;

-- La app (con o sin cuenta) solo ve las aprobadas.
create policy pregunta_verbal_leer_aprobadas on public.pregunta_verbal
  for select to anon, authenticated
  using (estado = 'aprobada');

-- El administrador ve y gestiona todas.
create policy pregunta_verbal_admin_leer on public.pregunta_verbal
  for select to authenticated
  using ((select private.es_admin()));
create policy pregunta_verbal_admin_crear on public.pregunta_verbal
  for insert to authenticated
  with check ((select private.es_admin()));
create policy pregunta_verbal_admin_cambiar on public.pregunta_verbal
  for update to authenticated
  using ((select private.es_admin()))
  with check ((select private.es_admin()));
create policy pregunta_verbal_admin_borrar on public.pregunta_verbal
  for delete to authenticated
  using ((select private.es_admin()));
