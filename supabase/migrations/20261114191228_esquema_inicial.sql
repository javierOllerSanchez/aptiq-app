-- Fase 5 · T2 · Esquema inicial de Aptiq (PRO-02, NFR-05, NFR-06).
--
-- Datos mínimos (NFR-05): semillas, respuestas, fechas y ajustes. Nunca el texto de
-- las preguntas (el motor las regenera con la semilla) ni el correo (solo en auth.users).
--
-- Cada tabla:
--   * lleva user_id con borrado en cascada desde auth.users (SOP-02: borrar la cuenta borra todo);
--   * tiene la clave primaria empezando por user_id, que sirve de índice para RLS y para la FK;
--   * tiene RLS activado y forzado, con políticas que comparan (select auth.uid()) = user_id;
--   * no da ningún permiso al rol anon.

-- Ajustes del usuario (oposición elegida, fecha del examen, nivel estimado...).
-- Se resuelven por la fecha más reciente (actualizado) entre dispositivos.
create table public.ajuste (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  clave text not null check (char_length(clave) between 1 and 64),
  valor text not null check (char_length(valor) <= 4096),
  actualizado timestamptz not null default now(),
  primary key (user_id, clave)
);

-- Semillas ya usadas: evitan repetir preguntas también entre dispositivos (CON-02).
create table public.semilla_usada (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  semilla text not null check (char_length(semilla) between 1 and 128),
  primary key (user_id, semilla)
);

-- Sesiones de práctica terminadas. El id lo genera el dispositivo: subir dos veces no duplica.
create table public.sesion (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 64),
  creada timestamptz not null,
  preguntas jsonb not null check (jsonb_typeof(preguntas) = 'array'),
  primary key (user_id, id)
);

-- Simulacros terminados. El simulacro abierto no se sube hasta entregarse, por eso fin es obligatorio.
create table public.intento_simulacro (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 64),
  empezado timestamptz not null,
  duracion_ms integer not null check (duracion_ms > 0),
  fin timestamptz not null,
  preguntas jsonb not null check (jsonb_typeof(preguntas) = 'array'),
  primary key (user_id, id),
  check (fin >= empezado)
);

-- Historial ordenado por fecha (PRO-02).
create index sesion_user_creada_idx on public.sesion (user_id, creada desc);
create index intento_simulacro_user_empezado_idx on public.intento_simulacro (user_id, empezado desc);

-- RLS en todas las tablas (NFR-06) y permisos explícitos: solo usuarios con sesión.
do $$
declare
  t text;
begin
  foreach t in array array['ajuste', 'semilla_usada', 'sesion', 'intento_simulacro'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);

    execute format(
      'create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)',
      t || '_leer_propias', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)',
      t || '_crear_propias', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      t || '_cambiar_propias', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = user_id)',
      t || '_borrar_propias', t);
  end loop;
end
$$;
