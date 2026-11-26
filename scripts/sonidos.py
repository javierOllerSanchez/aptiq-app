"""Genera los sonidos de recompensa de Aptiq (sin archivos de terceros).

Uso: python scripts/sonidos.py  ->  apps/mobile/assets/sonidos/*.wav
Notas cortas con un armónico suave, ataque rápido y caída exponencial: suenan a «campanita»
limpia, sin estridencias, y pesan pocos KB.
"""
import math
import struct
import wave
from pathlib import Path

RATE = 44100
OUT = Path(__file__).resolve().parent.parent / 'apps' / 'mobile' / 'assets' / 'sonidos'


def nota(freq, inicio, dur, vol, muestras):
    a0 = int(inicio * RATE)
    for i in range(int(dur * RATE)):
        t = i / RATE
        env = min(1.0, t / 0.008) * math.exp(-t * 7.5)  # ataque de 8 ms y caída
        v = math.sin(2 * math.pi * freq * t) + 0.25 * math.sin(2 * math.pi * 2 * freq * t)
        j = a0 + i
        if j < len(muestras):
            muestras[j] += vol * env * v


def escribe(nombre, notas, total):
    muestras = [0.0] * int(total * RATE)
    for f, ini, dur, vol in notas:
        nota(f, ini, dur, vol, muestras)
    pico = max(abs(x) for x in muestras) or 1
    k = 0.6 / pico  # margen: nunca satura
    with wave.open(str(OUT / f'{nombre}.wav'), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b''.join(struct.pack('<h', int(x * k * 32767)) for x in muestras))


C5, E5, G5, A5, C6, G4 = 523.25, 659.25, 783.99, 880.0, 1046.5, 392.0
OUT.mkdir(parents=True, exist_ok=True)
# Objetivo de hoy cumplido: arpegio do-mi-sol.
escribe('objetivo', [(C5, 0, .45, 1), (E5, .09, .45, 1), (G5, .18, .6, 1)], .8)
# Acierto en práctica: dos notas que suben.
escribe('acierto', [(E5, 0, .2, 1), (A5, .07, .3, 1)], .4)
# Simulacro terminado: arpegio de cuatro notas.
escribe('simulacro', [(G4, 0, .4, 1), (C5, .1, .4, 1), (E5, .2, .4, 1), (C6, .3, .7, 1)], 1.0)
print('Sonidos en', OUT)
