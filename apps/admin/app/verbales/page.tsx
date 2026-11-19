'use client';

import { type Level, loadBank, registry, validateVerbal, type VerbalEntry, type VerbalType } from '@aptiq/engine';
import { useCallback, useEffect, useMemo, useState } from 'react';

import borradores from '../../../../content/verbales/borradores.json';

import { Pregunta } from '@/components/pregunta';
import { cargarBanco, type Verbal } from '@/lib/banco';
import { supabase } from '@/lib/supabase';

type Filtro = Verbal['estado'];
const TIPOS: Record<VerbalType, string> = { 'VER.SINON': 'Sinónimos y antónimos', 'VER.ANALOG': 'Analogías verbales' };
const LETRAS = ['A', 'B', 'C', 'D'];

const vacia = (): Verbal => ({
  id: 'nueva',
  tipo: 'VER.SINON',
  nivel: 1,
  version: 1,
  estado: 'borrador',
  autoria: 'persona',
  enunciado: '',
  opciones: ['', '', '', ''],
  correcta: 0,
  explicacion: { observe: '', rule: '', apply: '', distractors: [], tip: '' },
});

/** ADM-01: revisar, editar, aprobar o rechazar las verbales. Solo las aprobadas llegan a la app. */
export default function Verbales() {
  const [filtro, setFiltro] = useState<Filtro>('borrador');
  const [todas, setTodas] = useState<Verbal[]>([]);
  const [edit, setEdit] = useState<Verbal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setTodas(await cargarBanco());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    void cargar();
  }, [cargar]);

  const problemas = edit ? validateVerbal(edit) : [];
  const vista = useMemo(() => {
    if (!edit || problemas.length) return null;
    // Vista previa con el motor, igual que en la app (4 opciones).
    loadBank([...todas.filter((t) => t.id !== edit.id), { ...edit, retirada: false }]);
    try {
      return registry[edit.tipo].generator.generate(`${edit.id}~0`, edit.nivel, 4);
    } catch {
      return null;
    }
  }, [edit, problemas.length, todas]);

  async function guardar(estado?: Filtro) {
    if (!edit) return;
    const datos = {
      tipo: edit.tipo,
      nivel: edit.nivel,
      enunciado: edit.enunciado.trim(),
      opciones: edit.opciones.map((o) => o.trim()),
      correcta: edit.correcta,
      explicacion: edit.explicacion,
      ...(estado ? { estado } : {}),
      // Una aprobada siempre lleva fecha (al editar la pone el disparador; al crear, aquí).
      ...(estado === 'aprobada' ? { aprobada_en: new Date().toISOString() } : {}),
    };
    const q =
      edit.id === 'nueva'
        ? supabase().from('pregunta_verbal').insert({ ...datos, autoria: 'persona' })
        : supabase().from('pregunta_verbal').update(datos).eq('id', edit.id);
    const { error: e } = await q;
    if (e) return setError(e.message);
    setError(null);
    setEdit(null);
    await cargar();
  }

  const set = (cambio: Partial<VerbalEntry>) => edit && setEdit({ ...edit, ...cambio });
  const setX = (cambio: Partial<Verbal['explicacion']>) =>
    edit && setEdit({ ...edit, explicacion: { ...edit.explicacion, ...cambio } });
  const errorDe = (i: number) => edit?.explicacion.distractors.find((d) => d.optionIndex === i)?.error ?? '';
  const setErrorDe = (i: number, error: string) =>
    edit &&
    setX({
      distractors: [...edit.explicacion.distractors.filter((d) => d.optionIndex !== i), { optionIndex: i, error }].sort(
        (a, b) => a.optionIndex - b.optionIndex,
      ),
    });

  const lista = todas.filter((t) => t.estado === filtro);
  // Borradores redactados en el repositorio que aún no están en la base de datos.
  const nuevos = (borradores as Omit<VerbalEntry, 'id' | 'version'>[]).filter(
    (b) => !todas.some((t) => t.enunciado === b.enunciado),
  );
  async function importar() {
    const { error: e } = await supabase()
      .from('pregunta_verbal')
      .insert(nuevos.map((b) => ({ ...b, estado: 'borrador', autoria: 'ia' })));
    if (e) return setError(e.message);
    await cargar();
  }
  const aprobadas = (t: VerbalType) => todas.filter((x) => x.tipo === t && x.estado === 'aprobada').length;

  return (
    <main>
      <h1>Preguntas verbales</h1>
      <p className="muted">
        Aprobadas: {TIPOS['VER.SINON']} {aprobadas('VER.SINON')} · {TIPOS['VER.ANALOG']} {aprobadas('VER.ANALOG')}. Un tipo
        aparece en la app con 10 aprobadas o más.
      </p>
      <div className="row" style={{ marginBottom: 16 }}>
        {(['borrador', 'aprobada', 'rechazada'] as const).map((f) => (
          <button key={f} className={f === filtro ? 'main' : ''} onClick={() => setFiltro(f)}>
            {f === 'borrador' ? 'Borradores' : f === 'aprobada' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        {nuevos.length > 0 && (
          <button onClick={() => void importar()}>Importar {nuevos.length} borradores del repositorio</button>
        )}
        <button onClick={() => setEdit(vacia())}>Nueva pregunta</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        <ul className="list card" aria-label="Preguntas">
          {lista.length === 0 && <li className="muted">No hay preguntas en este estado.</li>}
          {lista.map((v) => (
            <li key={v.id}>
              <button aria-current={edit?.id === v.id} onClick={() => setEdit(structuredClone(v))}>
                <span className="label">
                  {TIPOS[v.tipo]} · nivel {v.nivel} · {v.autoria === 'ia' ? 'borrador de IA' : 'persona'} · v{v.version}
                </span>
                <br />
                {v.enunciado}
              </button>
            </li>
          ))}
        </ul>
        {edit && (
          <section className="card stack" aria-label="Editar pregunta">
            <div className="row">
              <label style={{ flex: 2 }}>
                Tipo
                <select value={edit.tipo} onChange={(e) => set({ tipo: e.target.value as VerbalType })}>
                  {Object.entries(TIPOS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ flex: 1 }}>
                Nivel
                <select value={edit.nivel} onChange={(e) => set({ nivel: Number(e.target.value) as Level })}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Enunciado
              <input value={edit.enunciado} maxLength={300} onChange={(e) => set({ enunciado: e.target.value })} />
            </label>
            <fieldset className="stack" style={{ border: 'none', padding: 0 }}>
              <legend className="label">Opciones (marca la correcta) y por qué falla cada incorrecta</legend>
              {edit.opciones.map((o, i) => (
                <div key={i} className="stack" style={{ gap: 4 }}>
                  <div className="row">
                    <input
                      type="radio"
                      name="correcta"
                      aria-label={`La ${LETRAS[i]} es la correcta`}
                      checked={edit.correcta === i}
                      onChange={() => set({ correcta: i })}
                      style={{ width: 'auto', minHeight: 0 }}
                    />
                    <input
                      aria-label={`Opción ${LETRAS[i]}`}
                      value={o}
                      onChange={(e) => set({ opciones: edit.opciones.map((x, j) => (j === i ? e.target.value : x)) })}
                      style={{ flex: 1, width: 'auto' }}
                    />
                  </div>
                  {edit.correcta !== i && (
                    <input
                      aria-label={`Por qué falla la ${LETRAS[i]}`}
                      placeholder={`Por qué falla la ${LETRAS[i]}`}
                      value={errorDe(i)}
                      onChange={(e) => setErrorDe(i, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </fieldset>
            {(
              [
                ['observe', 'Observa'],
                ['rule', 'Regla'],
                ['apply', 'Aplica (debe llegar a la respuesta)'],
                ['tip', 'Truco de examen'],
              ] as const
            ).map(([k, nombre]) => (
              <label key={k}>
                {nombre}
                <textarea value={edit.explicacion[k]} onChange={(e) => setX({ [k]: e.target.value })} />
              </label>
            ))}
            {problemas.length > 0 && (
              <ul className="error">
                {problemas.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            {vista && (
              <div className="stack">
                <div className="label">Vista previa (como en la app)</div>
                <Pregunta item={vista} />
              </div>
            )}
            <div className="row">
              <button onClick={() => void guardar(edit.estado === 'aprobada' ? 'borrador' : undefined)}>
                {edit.estado === 'aprobada' ? 'Guardar y retirar de la app' : 'Guardar'}
              </button>
              <button className="main" disabled={problemas.length > 0} onClick={() => void guardar('aprobada')}>
                Aprobar
              </button>
              {edit.id !== 'nueva' && <button onClick={() => void guardar('rechazada')}>Rechazar</button>}
              <button onClick={() => setEdit(null)}>Cancelar</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
