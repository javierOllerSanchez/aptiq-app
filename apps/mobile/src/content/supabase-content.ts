import type { ExamProfile, VerbalEntry } from '@aptiq/engine';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { ContentRemote } from './content';

/** Lectura del contenido público de Supabase (RLS: la app solo ve las verbales aprobadas). */
export function createSupabaseContent(client: SupabaseClient): ContentRemote {
  return {
    async verbalesAprobadas() {
      // El filtro es explícito: una persona administradora con sesión en el móvil vería también borradores.
      const { data, error } = await client
        .from('pregunta_verbal')
        .select('id, tipo, nivel, version, enunciado, opciones, correcta, explicacion')
        .eq('estado', 'aprobada');
      if (error) throw error;
      return data as VerbalEntry[];
    },
    async ultimoPerfil(id) {
      const { data, error } = await client
        .from('perfil_examen')
        .select('datos')
        .eq('id', id)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data?.datos as ExamProfile | undefined) ?? null;
    },
  };
}
