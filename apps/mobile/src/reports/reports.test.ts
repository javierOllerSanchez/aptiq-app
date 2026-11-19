import { createMemoryStore } from '@/data/memory-store';

import { enviarPendientes, nuevoReporte, reportar, yaReportada, type ReportRemote, type Reporte } from './reports';

const base = {
  tipo: 'ESP.CUBO',
  nivel: 4,
  semilla: 'muestra-4-2',
  version: '1',
  opciones: 4,
  respuesta: 1,
  motivo: 'dos_correctas' as const,
  comentario: 'Creo que la C también vale',
};

const remoto = (falla = false) => {
  const enviados: Reporte[] = [];
  const remote: ReportRemote = {
    async enviar(r) {
      if (falla) throw new Error('sin red');
      enviados.push(r);
    },
  };
  return { remote, enviados };
};

test('un reporte se envía con la semilla y lo justo para reproducir la pregunta', async () => {
  const store = createMemoryStore();
  const { remote, enviados } = remoto();
  await reportar(store, remote, nuevoReporte(base, () => 'id-1'));
  expect(enviados).toEqual([{ id: 'id-1', ...base }]);
  expect(await yaReportada(store, 'ESP.CUBO', 'muestra-4-2')).toBe(true);
});

test('sin red se guarda y se envía al recuperarla, una sola vez', async () => {
  const store = createMemoryStore();
  await reportar(store, remoto(true).remote, nuevoReporte(base, () => 'id-2'));
  const { remote, enviados } = remoto();
  await enviarPendientes(store, remote);
  await enviarPendientes(store, remote);
  expect(enviados.map((r) => r.id)).toEqual(['id-2']);
});

test('el comentario se recorta a 500 caracteres y vacío no se envía', async () => {
  const largo = nuevoReporte({ ...base, comentario: 'x'.repeat(600) }, () => 'a');
  expect(largo.comentario).toHaveLength(500);
  const vacio = nuevoReporte({ ...base, comentario: '   ' }, () => 'b');
  expect(vacio.comentario).toBeNull();
});
