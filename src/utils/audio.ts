/**
 * Decodes a base64 string containing raw 16-bit PCM little-endian audio (at 24kHz)
 * into a standard Web Audio API AudioBuffer.
 */
export function decodePCMToAudioBuffer(
  audioContext: AudioContext,
  base64Data: string,
  sampleRate: number = 24000
): AudioBuffer {
  // Convert base64 to raw binary string
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert Uint8Array buffer to Int16Array (16-bit PCM)
  const int16Array = new Int16Array(bytes.buffer);

  // Convert Int16Array to Float32Array [-1.0, 1.0] for the audio buffer
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }

  // Create standard mono AudioBuffer inside the active AudioContext
  const audioBuffer = audioContext.createBuffer(1, float32Array.length, sampleRate);
  audioBuffer.getChannelData(0).set(float32Array);

  return audioBuffer;
}

/**
 * Play an AudioBuffer and return the source and node controls for clean cancellation.
 */
export function playDecodedAudioBuffer(
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  onEnded?: () => void
): { source: AudioBufferSourceNode; gainNode: GainNode; stop: () => void } {
  // Resume context if suspended (browser security constraint)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.85, audioContext.currentTime);

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  let isStopped = false;

  const stop = () => {
    if (!isStopped) {
      try {
        source.stop();
      } catch (e) {
        // Source might not have started or already stopped
      }
      isStopped = true;
    }
  };

  source.onended = () => {
    isStopped = true;
    if (onEnded) {
      onEnded();
    }
  };

  source.start(0);

  return { source, gainNode, stop };
}

/**
 * Play kids' synthesizer sound effect using Web Audio API oscillators.
 * No asset dependencies! Fully programmatic.
 */
export function playSynthSFX(type: "croak" | "honk" | "boing" | "chime" | "squeak" | "robot" | "twinkle") {
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    
    const now = ctx.currentTime;
    const mainGain = ctx.createGain();
    mainGain.connect(ctx.destination);

    if (type === "croak") {
      // Frog croak: slow low-pitched rattling envelope
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      // Fast modulation frequency step to create rattle "croak" effect
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);

      filter.type = "lowpass";
      filter.Q.setValueAtTime(10, now);
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);

      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(0.6, now + 0.05);
      mainGain.gain.linearRampToValueAtTime(0, now + 0.35);

      osc.connect(filter);
      filter.connect(mainGain);
      osc.start(now);
      osc.stop(now + 0.4);

    } else if (type === "honk") {
      // Car/toy honk: full direct square tone with second harmonic
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(290, now);
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(310, now);

      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(0.4, now + 0.03);
      mainGain.gain.setValueAtTime(0.4, now + 0.22);
      mainGain.gain.linearRampToValueAtTime(0, now + 0.28);

      // Low pass filter to make it warmer/cartoonish
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(mainGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);

    } else if (type === "boing") {
      // Bounce boing: quick descending/ascending frequency slide
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      // cartoonish pitch sweep up then down
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.45);

      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      mainGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(mainGain);
      osc.start(now);
      osc.stop(now + 0.5);

    } else if (type === "chime") {
      // Pixie magic fairy chime: overlapping ringing high frequencies
      const frequencies = [880, 1100, 1320, 1760];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        
        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.2, now + idx * 0.04 + 0.02);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.1);

        osc.connect(oscGain);
        oscGain.connect(mainGain);
        
        osc.start(now + idx * 0.04);
        osc.stop(now + 1.2);
      });
      mainGain.gain.setValueAtTime(0.7, now);

    } else if (type === "squeak") {
      // Squeaky plush toy: ultra-fast high frequency rise
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(0.4, now + 0.02);
      mainGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(mainGain);
      osc.start(now);
      osc.stop(now + 0.2);

    } else if (type === "robot") {
      // Tinkering bleep bloop sequence
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(800, now + 0.08);
      osc.frequency.setValueAtTime(600, now + 0.16);
      osc.frequency.setValueAtTime(1200, now + 0.24);

      mainGain.gain.setValueAtTime(0.25, now);
      mainGain.gain.setValueAtTime(0.25, now + 0.24);
      mainGain.gain.linearRampToValueAtTime(0, now + 0.32);

      osc.connect(mainGain);
      osc.start(now);
      osc.stop(now + 0.35);

    } else if (type === "twinkle") {
      // Twinkle twinkle random star drop
      const tones = [523.25, 659.25, 783.99, 1046.50];
      tones.forEach((tone, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(tone, now + idx * 0.08);

        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(g);
        g.connect(mainGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    }
  } catch (e) {
    console.warn("Web Audio API not allowed or supported yet:", e);
  }
}

