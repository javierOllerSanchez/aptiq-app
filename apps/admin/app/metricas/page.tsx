'use client';

import { taxonomy, type TypeCode } from '@aptiq/engine';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

interface Fila {
  tipo: string;
  nivel: number | null;
  familia: string | null;
  pregunta: string | null;
  respuestas: number;
  acierto: number;
  tiempo_medio_ms: number | null;
  discriminacion: number | null;
}

const pct = (n: number) => `${Math.round(n * 100)} %`;

/** ADM-02: acierto, tiempo y discriminación por tipo, nivel y familia, y por cada verbal. */
export default function Metricas() {
  const [filas, setFilas] = useState<Fila[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase()
      .rpc('metricas')
      .then(({ data, error: e }) => (e ? setError(e.message) : setFilas(data as Fila[])));
  }, []);

  return (
    <main>
      <h1>Métricas</h1>
      <p className="muted">
        Solo cuentan respuestas guardadas con cuenta. Discriminación: acierto del 27 % de usuarios que mejor lo hacen
        menos el del 27 % que peor (de −1 a 1; por debajo de 0,2 la pregunta apenas separa). Con menos de 30 respuestas:
        «pocos datos».
      </p>
      {error && <p className="error">{error}</p>}
      {filas && filas.length === 0 && <p>Aún no hay respuestas.</p>}
      {filas && filas.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nivel</th>
              <th>Familia o pregunta</th>
              <th>Respuestas</th>
              <th>Acierto</th>
              <th>Tiempo medio</th>
              <th>Discriminación</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => {
              const total = f.nivel === null && f.pregunta === null;
              return (
                <tr key={i} className={total ? 'total' : undefined}>
                  <td>{taxonomy[f.tipo as TypeCode]?.nombre ?? f.tipo}</td>
                  <td>{f.nivel ?? (total ? 'Todos' : '')}</td>
                  <td>{f.pregunta ? `Pregunta ${f.pregunta.slice(0, 8)}` : (f.familia ?? '')}</td>
                  <td className="num">{f.respuestas}</td>
                  <td className="num">{pct(f.acierto)}</td>
                  <td className="num">{f.tiempo_medio_ms === null ? '—' : `${(f.tiempo_medio_ms / 1000).toFixed(1)} s`}</td>
                  <td className="num">
                    {f.discriminacion === null ? 'pocos datos' : f.discriminacion.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
