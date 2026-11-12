---
name: aptiq-exam-profile
description: Usar al crear o actualizar el perfil de examen de una oposición en Aptiq (formato, penalización, nota mínima, proporción de tipos) a partir de fuentes oficiales con cita.
---

# Perfiles de examen de Aptiq

Un perfil describe cómo es la prueba de aptitudes psicotécnicas de una oposición en una convocatoria concreta. Los simulacros lo reproducen, así que **cada dato debe venir de una fuente oficial citada**. Un dato inventado o sacado de un blog destruye la confianza en la app.

## Fuentes permitidas

1. Bases de la convocatoria publicadas en el BOE.
2. Cuestionarios y plantillas publicados oficialmente por la institución tras el examen. Por ejemplo, la web de la Guardia Civil, el Ministerio del Interior o el INAP.

Blogs y academias solo sirven como pista para encontrar la fuente oficial, nunca como fuente. **No se guardan preguntas oficiales en el repositorio:** solo enlaces y recuentos.

## Formato

`packages/engine/profiles/<oposicion>-<año>.json`:

```json
{
  "id": "guardia-civil-2026",
  "oposicion": "Guardia Civil · Escala de Cabos y Guardias",
  "convocatoria": "2026",
  "version": 1,
  "sources": [
    { "organismo": "BOE", "titulo": "…", "url": "…", "tipo": "bases", "fechaConsulta": "YYYY-MM-DD" }
  ],
  "format": {
    "preguntas": null,
    "minutos": null,
    "opciones": 4,
    "puntuacion": { "maxima": 30, "minima": 12 }
  },
  "mix": null,
  "fieldSources": { "format.opciones": 0, "format.puntuacion.maxima": 0, "format.puntuacion.minima": 0 },
  "pendiente": ["format.preguntas", "format.minutos", "mix"],
  "notas": { "mix": "Por qué está pendiente." }
}
```

Esquema y validador en `packages/engine/src/profile.ts`; perfil de referencia: `profiles/guardia-civil-2026.json`.

- `fieldSources`: qué fuente (índice en `sources`) respalda cada dato.
- **Dato sin fuente oficial:** va a `null` y se lista en `pendiente`. La app muestra «Pendiente de confirmar».
- **Convocatoria nueva:** se crea un perfil nuevo; los antiguos no se editan.
- El esquema se valida en código, y una prueba falla si un dato no nulo no tiene entrada en `fieldSources`.

## Puntuación

Fórmula de las bases (BOE-A-2026-9982, base 7.3): P = Y/T × (A − E/(N − 1)). Y es la puntuación máxima (`puntuacion.maxima`), T el número de preguntas, A los aciertos, E los errores y N las opciones; las respuestas en blanco no restan. Implementada en `packages/engine/src/score.ts`, con casos calculados a mano en sus pruebas. Si unas bases dan otra fórmula, se usa la de las bases y se cita.

## Proporción de tipos (`mix`)

1. Descargar los cuestionarios oficiales de las últimas convocatorias disponibles.
2. Clasificar cada pregunta en la taxonomía del motor, sin copiar su texto.
3. Guardar los recuentos en `packages/engine/profiles/analysis/<oposicion>-<año>.md`: convocatoria, preguntas por tipo y enlace.
4. La proporción es la media de las convocatorias analizadas. Si varía mucho entre años, se indica.
5. Un tipo sin generador todavía se marca como no cubierto, y el simulacro avisa.

## Guardia Civil (convocatoria 2026)

Confirmado en el BOE (fase 3): 80 preguntas, 55 minutos, 4 opciones, fórmula de la base 7.3, escala 0-30 y mínimo de 12. La Guardia Civil **no publica el cuestionario de aptitudes** (solo la plantilla de respuestas), así que el paso de «Proporción de tipos» no se puede hacer: `mix` queda pendiente. Detalle en `profiles/analysis/guardia-civil-2026.md`.

## Revisión

Cada perfil lo revisa el propietario del producto antes de publicarse, y se revisa de nuevo con cada convocatoria.
