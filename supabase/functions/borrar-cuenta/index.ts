// Fase 5 · T6 · Borrar la cuenta del usuario que llama (SOP-02).
//
// La clave de servicio solo existe aquí, en el servidor de Supabase (NFR-06); la app nunca la ve.
// El usuario se identifica con su propio token: nadie puede borrar la cuenta de otro.
// Al borrar el usuario de auth.users, `on delete cascade` elimina todas sus filas.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.119.0';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'metodo_no_permitido' });

  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json(401, { error: 'sin_sesion' });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return json(401, { error: 'sin_sesion' });

  const { error: delError } = await admin.auth.admin.deleteUser(data.user.id);
  if (delError) return json(500, { error: 'no_borrada' });

  return json(200, { ok: true });
});
