import { type Drawing, type Item, registry } from '@aptiq/engine';

const LETTERS = ['A', 'B', 'C', 'D'];
const paint = (p: string) => (p === 'none' ? 'none' : p === 'paper' ? 'var(--paperCard)' : `var(--${p})`);

/** Dibujo del motor (los mismos trazos que pinta el móvil). */
export function Figura({ d, label, big = false }: { d: Drawing; label: string; big?: boolean }) {
  return (
    <svg
      className={big ? 'figure big' : 'figure'}
      viewBox={`0 0 ${d.size} ${d.size}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {d.shapes.map((s, i) => (
        <path key={i} d={s.d} fill={paint(s.fill)} stroke={paint(s.stroke)} strokeWidth={s.width} strokeLinejoin="round" />
      ))}
    </svg>
  );
}

/** Pregunta completa como la vio la persona, con la correcta, su respuesta y la explicación. */
export function Pregunta({ item, respuesta }: { item: Item; respuesta?: number | null }) {
  const gen = registry[item.type].generator;
  const stem = gen.draw?.stem(item.stem);
  const errores = new Map(item.explanation.distractors.map((d) => [d.optionIndex, d.error]));
  return (
    <div className="stack">
      <div className="stem">{item.stem.text}</div>
      {stem && (
        // La descripción va una sola vez en el grupo; cada figura de la serie es decorativa.
        <div className="row" role="img" aria-label={stem.alt}>
          {stem.drawings.map((d, i) => (
            <Figura key={i} d={d} label="" big={stem.drawings.length === 1} />
          ))}
        </div>
      )}
      <div className="stack">
        {item.options.map((o, i) => (
          <div key={i} className={i === item.answerIndex ? 'option correct' : 'option'}>
            <span className="bubble">{LETTERS[i]}</span>
            {gen.draw ? <Figura d={gen.draw.option(o)} label={gen.describe?.(o) ?? o} /> : <strong>{o}</strong>}
            <span className="muted">
              {i === item.answerIndex ? 'Correcta' : errores.get(i)}
              {i === respuesta ? ' · Respondió esta' : ''}
            </span>
          </div>
        ))}
        {respuesta === null && <span className="muted">La dejó en blanco.</span>}
      </div>
      <div className="stack">
        <Paso t="Observa" x={item.explanation.observe} />
        <Paso t="Regla" x={item.explanation.rule} />
        <Paso t="Aplica" x={item.explanation.apply} />
        <Paso t="Truco" x={item.explanation.tip} />
      </div>
    </div>
  );
}

const Paso = ({ t, x }: { t: string; x: string }) => (
  <div>
    <div className="label">{t}</div>
    <div>{x}</div>
  </div>
);
