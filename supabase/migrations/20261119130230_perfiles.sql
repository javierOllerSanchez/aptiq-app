-- Fase 8 · T13 · Perfiles de examen editables sin publicar la app (ADM-03).
--
-- Cada cambio de un perfil es una versión nueva: las versiones publicadas no se editan ni se
-- borran (skill aptiq-exam-profile). La app descarga la última, la valida con el motor
-- (`validateProfile`) y, si no es válida, sigue con la que trae dentro.
-- Los perfiles son públicos (citan el BOE): cualquiera los lee; solo el administrador publica.

create table public.perfil_examen (
  id text not null check (char_length(id) between 1 and 64),
  version integer not null check (version >= 1),
  datos jsonb not null check (
    jsonb_typeof(datos) = 'object'
    and datos ->> 'id' = id
    and (datos ->> 'version')::integer = version
  ),
  publicado_en timestamptz not null default now(),
  primary key (id, version)
);

alter table public.perfil_examen enable row level security;
alter table public.perfil_examen force row level security;
revoke all on public.perfil_examen from anon, authenticated;
grant select on public.perfil_examen to anon, authenticated;
grant insert on public.perfil_examen to authenticated;

create policy perfil_examen_leer on public.perfil_examen
  for select to anon, authenticated
  using (true);
create policy perfil_examen_admin_publicar on public.perfil_examen
  for insert to authenticated
  with check ((select private.es_admin()));
