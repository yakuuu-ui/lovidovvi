
/**
 * Simple Web Audio API sound synthesizer
 * Avoids external asset dependencies
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted() {
    return this.isMuted;
  }

  playError() {
    // Silenced
  }

  playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getCtx();
    
    // Create rhythmic white noise bursts to simulate clapping
    const playBurst = (time: number) => {
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, time);
      filter.Q.setValueAtTime(1, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(time);
      noise.stop(time + 0.1);
    };

    const now = ctx.currentTime;
    // Rhythmic claps
    for (let i = 0; i < 5; i++) {
      playBurst(now + (i * 0.12));
    }
  }

  playBoot() {
    // Silenced
  }

  playTick() {
    // Silenced
  }
}

export const soundService = new SoundService();
