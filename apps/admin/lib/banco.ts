import { loadBank, type VerbalEntry } from '@aptiq/engine';

import { supabase } from './supabase';

export type Verbal = VerbalEntry & { estado: 'borrador' | 'aprobada' | 'rechazada'; autoria: 'ia' | 'persona' };

/** Todas las verbales (el administrador ve también borradores) y las carga en el motor para reproducirlas. */
export async function cargarBanco(): Promise<Verbal[]> {
  const { data, error } = await supabase()
    .from('pregunta_verbal')
    .select('id, tipo, nivel, version, estado, autoria, enunciado, opciones, correcta, explicacion')
    .order('creada', { ascending: false });
  if (error) throw error;
  const rows = data as Verbal[];
  loadBank(rows.map((r) => ({ ...r, retirada: r.estado !== 'aprobada' })));
  return rows;
}
