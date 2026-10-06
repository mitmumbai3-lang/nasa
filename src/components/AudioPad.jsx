import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPad() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const nodesRef = useRef([]);

  // Setup Web Audio Pad Drone
  const initAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGainRef.current = masterGain;

      // Low pass filter for soft cathedral warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(380, ctx.currentTime);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      // Sacred Drone chord: D harmonic series (D2 73.4Hz, A2 110Hz, D3 146.8Hz, F3 174.6Hz, A3 220Hz)
      const frequencies = [73.42, 110.0, 146.83, 174.61, 220.0, 293.66];
      const createdNodes = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Layer warm sine and triangle waves
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        // Subtle organic detuning for lush chorusing
        const detune = (idx - 2.5) * 4.2;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);

        const targetGain = 0.08 / (idx * 0.4 + 1);
        oscGain.gain.setValueAtTime(targetGain, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();

        createdNodes.push(osc);
      });

      nodesRef.current = createdNodes;
    } catch (e) {
      console.warn("Web Audio pad unavailable in this browser", e);
    }
  };

  const toggleSound = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (!isPlaying) {
      // Fade in master gain smoothly
      masterGainRef.current?.gain.cancelScheduledValues(ctx.currentTime);
      masterGainRef.current?.gain.setTargetAtTime(0.35, ctx.currentTime, 1.8);
      setIsPlaying(true);
    } else {
      // Fade out master gain smoothly
      masterGainRef.current?.gain.cancelScheduledValues(ctx.currentTime);
      masterGainRef.current?.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSound}
        className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all duration-300 ${
          isPlaying
            ? "border-[#C8A66A] bg-[#C8A66A]/20 text-[#FFF7E8] shadow-[0_0_15px_rgba(200,166,106,0.3)]"
            : "border-[#E7D8BB]/20 bg-[#161514]/60 text-[#E7D8BB]/70 hover:border-[#C8A66A]/50 hover:text-[#E7D8BB]"
        }`}
        aria-label={isPlaying ? "Mute ambient sacred music" : "Play ambient sacred music"}
        title={isPlaying ? "Mute sacred cathedral ambience" : "Listen to sacred contemplative ambience"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="h-3.5 w-3.5 text-[#C8A66A] animate-pulse" />
            <span className="hidden sm:inline font-sans text-[11px] uppercase tracking-wider text-[#C8A66A]">
              Sacred Ambience
            </span>
            {/* Visualizer bars */}
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#C8A66A] h-2 animate-[pulse_1s_infinite_100ms]" />
              <span className="w-0.5 bg-[#C8A66A] h-3 animate-[pulse_1.2s_infinite_300ms]" />
              <span className="w-0.5 bg-[#C8A66A] h-1.5 animate-[pulse_0.9s_infinite_200ms]" />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="h-3.5 w-3.5 text-[#E7D8BB]/60 group-hover:text-[#C8A66A]" />
            <span className="hidden sm:inline font-sans text-[11px] uppercase tracking-wider">
              Sound Off
            </span>
          </>
        )}
      </button>
    </div>
  );
}
