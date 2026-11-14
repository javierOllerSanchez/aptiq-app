const BASE_MS = 5_000;
const MAX_MS = 15 * 60_000;

/** Espera antes del siguiente intento: 5 s, 10 s, 20 s… hasta 15 min. */
export function retryDelay(failures: number): number {
  return Math.min(BASE_MS * 2 ** failures, MAX_MS);
}

interface RetrierDeps {
  /** Un intento de sincronizar; `true` si fue bien. */
  run: () => Promise<boolean>;
  /** Programa `fn` dentro de `ms` y devuelve cómo cancelarlo (en la app, `setTimeout`). */
  schedule: (fn: () => void | Promise<void>, ms: number) => () => void;
}

/**
 * Lanza la sincronización y, si falla, la reintenta con espera creciente.
 * `trigger` se llama al abrir la app y al recuperar la red (se conecta en T4); un aviso nuevo
 * cancela la espera pendiente y vuelve a empezar desde la espera corta.
 */
export function createRetrier({ run, schedule }: RetrierDeps) {
  let failures = 0;
  let cancel: (() => void) | null = null;
  let running = false;

  async function attempt(): Promise<void> {
    if (running) return;
    running = true;
    cancel = null;
    let ok = false;
    try {
      ok = await run();
    } catch {
      ok = false;
    } finally {
      running = false;
    }
    if (ok) {
      failures = 0;
      return;
    }
    cancel = schedule(attempt, retryDelay(failures));
    failures += 1;
  }

  return {
    async trigger() {
      cancel?.();
      failures = 0;
      await attempt();
    },
    stop() {
      cancel?.();
      cancel = null;
    },
  };
}
