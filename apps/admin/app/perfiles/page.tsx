'use client';

import { type ExamProfile, profiles, validateProfile } from '@aptiq/engine';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

interface Publicado {
  version: number;
  publicado_en: string;
  datos: ExamProfile;
}

/**
 * ADM-03: editar un perfil sin publicar la app. Cada cambio se publica como versión nueva
 * (las anteriores no se tocan) y solo si pasa el validador del motor.
 * Hoy la app solo descarga el perfil de la Guardia Civil.
 */
export default function Perfiles() {
  const [id, setId] = useState('guardia-civil-2026');
  const [versiones, setVersiones] = useState<Publicado[]>([]);
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  const base = profiles[id]!;
  const ultima = versiones[0]?.datos ?? base;
  const siguiente = Math.max(base.version, ultima.version) + 1;

  const cargar = useCallback(async () => {
    const { data, error } = await supabase()
      .from('perfil_examen')
      .select('version, publicado_en, datos')
      .eq('id', id)
      .order('version', { ascending: false });
    if (error) return setMensaje(error.message);
    const v = data as Publicado[];
    setVersiones(v);
    setTexto(JSON.stringify({ ...(v[0]?.datos ?? profiles[id]), version: undefined }, null, 2));
  }, [id]);
  useEffect(() => {
    void cargar();
  }, [cargar]);

  let perfil: ExamProfile | null = null;
  let problemas: string[] = [];
  try {
    perfil = { ...(JSON.parse(texto) as ExamProfile), id, version: siguiente };
    problemas = validateProfile(perfil);
  } catch (e) {
    problemas = [`El texto no es JSON válido: ${(e as Error).message}`];
  }

  async function publicar() {
    if (!perfil || problemas.length) return;
    const { error } = await supabase().from('perfil_examen').insert({ id, version: siguiente, datos: perfil });
    setMensaje(error ? error.message : `Publicada la versión ${siguiente}. La app la usará la próxima vez que se conecte.`);
    if (!error) void cargar();
  }

  return (
    <main>
      <h1>Perfiles de examen</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        <label style={{ minWidth: 320 }}>
          Perfil
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {Object.values(profiles).map((p) => (
              <option key={p.id} value={p.id}>
                {p.oposicion} · {p.convocatoria}
              </option>
            ))}
          </select>
        </label>
      </div>
      {id !== 'guardia-civil-2026' && (
        <p className="notice info">Este perfil aún no se muestra en la app (decisión del propietario): publicarlo no cambia nada para los usuarios.</p>
      )}
      <div className="grid">
        <section className="card stack">
          <div className="label">Versiones publicadas</div>
          <p className="muted">La app trae la versión {base.version}. Las publicadas aquí la sustituyen si son válidas.</p>
          {versiones.length === 0 && <p>Ninguna todavía.</p>}
          <ul>
            {versiones.map((v) => (
              <li key={v.version}>
                Versión {v.version} · {new Date(v.publicado_en).toLocaleString('es-ES')}
              </li>
            ))}
          </ul>
        </section>
        <section className="card stack">
          <label>
            Perfil (JSON). Cada dato con su fuente oficial en «fieldSources»; lo no confirmado, null y en «pendiente».
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              spellCheck={false}
              style={{ minHeight: 420, fontFamily: 'var(--font-mono), monospace', fontSize: 'var(--t-caption)' }}
            />
          </label>
          {problemas.length > 0 ? (
            <ul className="error">
              {problemas.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            <p>Válido. Se publicará como versión {siguiente}.</p>
          )}
          {mensaje && <p>{mensaje}</p>}
          <div>
            <button className="main" disabled={problemas.length > 0} onClick={() => void publicar()}>
              Publicar versión {siguiente}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
