let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AudioCtx();
  }
  return ctx;
}

function tone(
  audioCtx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gainPeak = 0.12,
) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function primeAudio() {
  const audioCtx = getContext();
  if (audioCtx?.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

export function playSuccessChime() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }

  const now = audioCtx.currentTime;
  tone(audioCtx, 587.33, now, 0.22); // D5
  tone(audioCtx, 880, now + 0.09, 0.32); // A5
}
