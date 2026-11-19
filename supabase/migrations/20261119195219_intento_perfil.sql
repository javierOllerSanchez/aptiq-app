-- Fase 9 · T5 · ADM-03: cada simulacro guarda el perfil con que empezó (id, versión y formato)
-- y se puntúa siempre con él, aunque después se publique otra versión.
-- Nulo en los anteriores: se hicieron con el perfil que trae la app.
alter table public.intento_simulacro
  add column perfil jsonb check (perfil is null or jsonb_typeof(perfil) = 'object');
