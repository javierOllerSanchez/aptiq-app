'use client';

import { isBankType, taxonomy, type TypeCode } from '@aptiq/engine';
import { useCallback, useEffect, useState } from 'react';

import { Pregunta } from '@/components/pregunta';
import { cargarBanco } from '@/lib/banco';
import { type Estado, MOTIVOS, type Reporte, reproducir } from '@/lib/reportes';
import { supabase } from '@/lib/supabase';

export default function Reportes() {
  const [estado, setEstado] = useState<Estado>('nuevo');
  const [lista, setLista] = useState<Reporte[]>([]);
  const [sel, setSel] = useState<Reporte | null>(null);
  const [nota, setNota] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [banco, setBanco] = useState(false);

  const cargar = useCallback(async () => {
    const { data, error: e } = await supabase()
      .from('reporte')
      .select('*')
      .eq('estado', estado)
      .order('creado', { ascending: false })
      .limit(200);
    if (e) setError(e.message);
    else setLista(data as Reporte[]);
  }, [estado]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function abrir(r: Reporte) {
    if (isBankType(r.tipo as TypeCode) && !banco) {
      await cargarBanco();
      setBanco(true);
    }
    setSel(r);
    setNota(r.nota ?? '');
  }

  async function cerrar(nuevo: Estado) {
    if (!sel) return;
    const { error: e } = await supabase().from('reporte').update({ estado: nuevo, nota: nota || null }).eq('id', sel.id);
    if (e) return setError(e.message);
    setSel(null);
    void cargar();
  }

  const rep = sel ? reproducir(sel) : null;
  return (
    <main>
      <h1>Reportes</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        {(['nuevo', 'resuelto', 'descartado'] as const).map((e) => (
          <button key={e} className="filtro" aria-pressed={e === estado} onClick={() => setEstado(e)}>
            {e === 'nuevo' ? 'Nuevos' : e === 'resuelto' ? 'Resueltos' : 'Descartados'}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        <ul className="list card" aria-label="Reportes">
          {lista.length === 0 && <li className="muted">No hay reportes.</li>}
          {lista.map((r) => (
            <li key={r.id}>
              <button aria-current={sel?.id === r.id} onClick={() => void abrir(r)}>
                <span className="label">
                  {new Date(r.creado).toLocaleString('es-ES')} · {r.tipo} · nivel {r.nivel}
                </span>
                <br />
                {MOTIVOS[r.motivo] ?? r.motivo}
                {r.comentario ? ` — «${r.comentario}»` : ''}
              </button>
            </li>
          ))}
        </ul>
        {sel && rep && (
          <section className="card stack" aria-label="Reporte seleccionado">
            <div className="label">
              {taxonomy[sel.tipo as TypeCode]?.nombre ?? sel.tipo} · nivel {sel.nivel} · semilla {sel.semilla} · versión{' '}
              {sel.version} · {sel.opciones} opciones
            </div>
            <div>
              <strong>{MOTIVOS[sel.motivo]}</strong>
              {sel.comentario && <p>«{sel.comentario}»</p>}
            </div>
            {rep.aviso && <p className="notice">{rep.aviso}</p>}
            {rep.error && <p className="error">No se puede reproducir: {rep.error}</p>}
            {rep.item && <Pregunta item={rep.item} respuesta={sel.respuesta} />}
            <label>
              Nota interna
              <textarea value={nota} onChange={(e) => setNota(e.target.value)} maxLength={1000} />
            </label>
            <div className="row">
              <button className="main" onClick={() => void cerrar('resuelto')}>
                Marcar como resuelto
              </button>
              <button onClick={() => void cerrar('descartado')}>Descartar</button>
              {sel.estado !== 'nuevo' && <button onClick={() => void cerrar('nuevo')}>Volver a nuevo</button>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
