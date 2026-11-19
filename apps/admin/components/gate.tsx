'use client';

import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';

import { esAdmin, supabase } from '@/lib/supabase';

const SECCIONES = [
  { href: '/reportes', nombre: 'Reportes' },
  { href: '/verbales', nombre: 'Verbales' },
  { href: '/perfiles', nombre: 'Perfiles' },
  { href: '/metricas', nombre: 'Métricas' },
];

/** Entrada al panel con enlace mágico; sin marca de administrador no se enseña nada. */
export function Gate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const path = usePathname();

  useEffect(() => {
    try {
      const sb = supabase();
      sb.auth.getSession().then(({ data }) => setSession(data.session));
      const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
      return () => data.subscription.unsubscribe();
    } catch (e) {
      setError((e as Error).message);
      setSession(null);
    }
  }, []);

  if (error) return <main className="error">{error}</main>;
  if (session === undefined) return <main className="muted">Cargando…</main>;
  if (!session) return <Entrar />;
  if (!esAdmin(session))
    return (
      <main className="stack">
        <h1>Sin permiso</h1>
        <p>
          Has entrado como {session.user.email}, pero este usuario no es administrador. Si acabas de recibir el
          permiso, sal y vuelve a entrar para que se actualice.
        </p>
        <div>
          <button onClick={() => supabase().auth.signOut()}>Salir</button>
        </div>
      </main>
    );
  return (
    <>
      <nav className="nav" aria-label="Secciones del panel">
        <strong>Aptiq · Panel</strong>
        {SECCIONES.map((s) => (
          <Link key={s.href} href={s.href} aria-current={path.startsWith(s.href) ? 'page' : undefined}>
            {s.nombre}
          </Link>
        ))}
        <span className="grow" />
        <span className="muted">{session.user.email}</span>
        <button onClick={() => supabase().auth.signOut()}>Salir</button>
      </nav>
      {children}
    </>
  );
}

function Entrar() {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'enviado' | string>('listo');

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEstado('enviando');
    const { error } = await supabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin, shouldCreateUser: false },
    });
    setEstado(error ? `No se pudo enviar el enlace: ${error.message}` : 'enviado');
  }

  return (
    <main className="stack" style={{ maxWidth: 480 }}>
      <h1>Panel interno</h1>
      {estado === 'enviado' ? (
        <p>Te hemos enviado un enlace a {email}. Ábrelo en este mismo navegador.</p>
      ) : (
        <form className="stack" onSubmit={enviar}>
          <label>
            Correo
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <div>
            <button className="main" type="submit" disabled={estado === 'enviando'}>
              Enviar enlace
            </button>
          </div>
          {estado !== 'listo' && estado !== 'enviando' && <p className="error">{estado}</p>}
        </form>
      )}
    </main>
  );
}
