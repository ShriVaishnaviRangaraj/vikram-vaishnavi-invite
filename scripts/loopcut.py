"""Find a musically similar loop point and bake a seamless crossfade.

usage: loopcut.py SRC OUT.wav A_MIN A_MAX B_MIN B_MAX [XFADE]
Searches start a in [A_MIN, A_MAX] and end b in [B_MIN, B_MAX] (seconds) for the pair
whose next few seconds sound most alike, then writes src[a:b] with its head crossfaded
from src[b:b+X], so playback wraps from b back to a without a seam.
"""
import subprocess
import sys

import numpy as np

SR = 44100
HOP = 512
WIN = 2048
CMP = 4.0  # seconds compared after each candidate point


def decode(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def features(mono):
    n = 1 + (len(mono) - WIN) // HOP
    idx = np.arange(WIN)[None, :] + HOP * np.arange(n)[:, None]
    frames = mono[idx] * np.hanning(WIN)
    mag = np.abs(np.fft.rfft(frames, axis=1))[:, :512]
    logmag = np.log1p(mag)
    flux = np.maximum(np.diff(logmag, axis=0, prepend=logmag[:1]), 0).sum(axis=1)
    return logmag, flux


def corr(x, y):
    x = x - x.mean()
    y = y - y.mean()
    return float((x * y).sum() / (np.sqrt((x * x).sum() * (y * y).sum()) + 1e-9))


def main():
    src, out = sys.argv[1], sys.argv[2]
    a0, a1, b0, b1 = map(float, sys.argv[3:7])
    xfade = float(sys.argv[7]) if len(sys.argv) > 7 else 1.5
    audio = decode(src)
    logmag, flux = features(audio.mean(axis=1))
    fps = SR / HOP
    w = int(CMP * fps)

    best = None
    for fa in range(int(a0 * fps), int(a1 * fps) + 1, 2):
        for fb in range(int(b0 * fps), int(b1 * fps) + 1):
            s = corr(flux[fa:fa + w], flux[fb:fb + w]) + corr(logmag[fa:fa + w], logmag[fb:fb + w])
            if best is None or s > best[0]:
                best = (s, fa, fb)
    score, fa, fb = best
    a, b = fa * HOP, fb * HOP
    x = int(xfade * SR)
    print(f"a={a / SR:.3f}s b={b / SR:.3f}s loop={(b - a) / SR:.3f}s score={score:.3f}")

    loop = audio[a:b].copy()
    t = np.linspace(0, np.pi / 2, x)[:, None]
    loop[:x] = audio[a:a + x] * np.sin(t) + audio[b:b + x] * np.cos(t)
    pcm = (np.clip(loop, -1, 1) * 32767).astype("<i2")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", out],
        input=pcm.tobytes(), check=True,
    )


if __name__ == "__main__":
    main()
