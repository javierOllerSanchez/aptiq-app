-- Fase 8 · T9 · Reportes de errores desde la pregunta (SOP-01, ADM-01).
--
-- Un reporte guarda lo justo para reproducir la pregunta con el motor: tipo, nivel, semilla,
-- versión del generador y número de opciones; además, el motivo, un comentario opcional y lo que
-- respondió la persona. Nunca el correo ni el usuario: también se reporta sin cuenta.
-- La app solo puede crear reportes; leerlos y gestionarlos es cosa del administrador.

create table public.reporte (
  -- Lo genera el móvil: reenviar el mismo reporte no lo duplica.
  id uuid primary key,
  tipo text not null check (char_length(tipo) between 1 and 32),
  nivel smallint not null check (nivel between 1 and 5),
  semilla text not null check (char_length(semilla) between 1 and 128),
  version text not null check (char_length(version) between 1 and 32),
  opciones smallint not null check (opciones in (3, 4)),
  respuesta smallint check (respuesta between 0 and 3),
  motivo text not null check (motivo in ('dos_correctas', 'correcta_mal', 'explicacion', 'no_se_entiende', 'otro')),
  comentario text check (char_length(comentario) <= 500),
  estado text not null default 'nuevo' check (estado in ('nuevo', 'resuelto', 'descartado')),
  nota text check (char_length(nota) <= 1000),
  creado timestamptz not null default now()
);

-- El panel lista primero los nuevos, los más recientes arriba.
create index reporte_estado_creado_idx on public.reporte (estado, creado desc);

alter table public.reporte enable row level security;
alter table public.reporte force row level security;
revoke all on public.reporte from anon, authenticated;
grant insert on public.reporte to anon, authenticated;
grant select, update, delete on public.reporte to authenticated;

-- Cualquiera (con o sin cuenta) crea reportes nuevos, sin nota ni estado propios.
create policy reporte_crear on public.reporte
  for insert to anon, authenticated
  with check (estado = 'nuevo' and nota is null and creado > now() - interval '1 minute');

create policy reporte_admin_leer on public.reporte
  for select to authenticated
  using ((select private.es_admin()));
create policy reporte_admin_cambiar on public.reporte
  for update to authenticated
  using ((select private.es_admin()))
  with check ((select private.es_admin()));
create policy reporte_admin_borrar on public.reporte
  for delete to authenticated
  using ((select private.es_admin()));
