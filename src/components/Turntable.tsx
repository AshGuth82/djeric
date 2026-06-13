import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, RotateCw, Volume2, Music, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface TurntableProps {
  currentBpm: number;
  onBpmChange: (newBpm: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function Turntable({
  currentBpm,
  onBpmChange,
  isPlaying,
  onTogglePlay,
}: TurntableProps) {
  const [pitch, setPitch] = useState<number>(0); // -8% to +8%
  const [speedMode, setSpeedMode] = useState<33 | 45>(33);
  const [rotation, setRotation] = useState<number>(0);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [crossfader, setCrossfader] = useState<number>(50); // 0 (left) to 100 (right)
  const [slipMode, setSlipMode] = useState<boolean>(false);

  // Audio elements for immersive synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const crackleNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const turntableRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const baseBpm = 124; // Reference BPM for calculations

  // Initialize Audio Context on gesture
  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Low frequency rumble for vinyl feel
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // low G/A note rumble

      // High pass and bandpass for vinyl crackle (using standard noise ScriptProcessor)
      let scriptNode: ScriptProcessorNode | null = null;
      if (ctx.createScriptProcessor) {
        scriptNode = ctx.createScriptProcessor(4096, 0, 1);
        scriptNode.onaudioprocess = (e) => {
          const outputBuffer = e.outputBuffer;
          const channelData = outputBuffer.getChannelData(0);
          for (let sample = 0; sample < outputBuffer.length; sample++) {
            // Generate periodic pops & white noise crackle
            const r = Math.random();
            if (r > 0.9995) {
              channelData[sample] = (Math.random() * 2 - 1) * 0.15; // Pop
            } else {
              channelData[sample] = (Math.random() * 2 - 1) * 0.003; // Background crackle
            }
          }
        };
        const scriptGain = ctx.createGain();
        scriptGain.gain.setValueAtTime(0.04, ctx.currentTime);
        scriptNode.connect(scriptGain);
        scriptGain.connect(ctx.destination);
        crackleNodeRef.current = scriptNode;
      }

      gain.gain.setValueAtTime(0, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn("Audio Context init blocked or failed: ", e);
    }
  };

  // Handle Play/Pause Audio Effects
  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      gainNodeRef.current.gain.linearRampToValueAtTime(0.08, audioCtxRef.current.currentTime + 0.5);
    } else if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.3);
    }
  }, [isPlaying]);

  // Adjust live synthesizer frequency based on pitch and scratches
  useEffect(() => {
    if (oscillatorRef.current && audioCtxRef.current) {
      const scale = 1 + pitch / 100;
      const baseFreq = speedMode === 45 ? 75 : 55;
      const targetFreq = baseFreq * scale * (isScratching ? 2.5 : 1);
      oscillatorRef.current.frequency.setValueAtTime(targetFreq, audioCtxRef.current.currentTime);
    }
  }, [pitch, speedMode, isScratching]);

  // Spinning loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (isPlaying && !isScratching) {
        // Higher BPM and higher RPM speeds up rotation
        const speedMultiplier = (speedMode === 45 ? 1.35 : 1.0) * (1 + pitch / 100);
        setRotation((prev) => (prev + speedMultiplier * 2) % 360);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isScratching, pitch, speedMode]);

  // Calculate BPM based on pitch slider
  useEffect(() => {
    const calcBpm = Math.round(baseBpm * (1 + pitch / 100));
    onBpmChange(calcBpm);
  }, [pitch]);

  // Clean up Audio Nodes on Unmount
  useEffect(() => {
    return () => {
      try {
        if (oscillatorRef.current) oscillatorRef.current.stop();
        if (crackleNodeRef.current) crackleNodeRef.current.disconnect();
      } catch (err) {}
    };
  }, []);

  // Vinyl Drag/Scratching Events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    initAudio();
    setIsScratching(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isScratching || !turntableRef.current) return;

    const rect = turntableRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Direct angle calculation relative to center
    const prevAngle = Math.atan2(lastMousePos.current.y - centerY, lastMousePos.current.x - centerX);
    const newAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    // Dynamic rotation change
    const deltaDegrees = (newAngle - prevAngle) * (180 / Math.PI);
    if (!isNaN(deltaDegrees)) {
      setRotation((prev) => (prev + deltaDegrees) % 360);

      // Web Audio scratch sound frequency variation
      if (oscillatorRef.current && audioCtxRef.current) {
        const scratchSpeed = Math.abs(deltaDegrees) * 8;
        const scratchFreq = Math.min(Math.max(scratchSpeed * 12 + 60, 100), 1200);
        oscillatorRef.current.frequency.setValueAtTime(scratchFreq, audioCtxRef.current.currentTime);

        // Adjust gain dynamically based on gesture velocity
        if (gainNodeRef.current) {
          const scratchVolume = Math.min(Math.abs(deltaDegrees) * 0.05, 0.25);
          gainNodeRef.current.gain.setValueAtTime(scratchVolume, audioCtxRef.current.currentTime);
        }
      }
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    if (!isScratching) return;
    setIsScratching(false);

    // Reset gain to normal or zero depends on isPlaying
    if (gainNodeRef.current && audioCtxRef.current) {
      const normalGain = isPlaying ? 0.08 : 0;
      gainNodeRef.current.gain.setValueAtTime(normalGain, audioCtxRef.current.currentTime + 0.1);
    }
  };

  return (
    <div id="deck-section" className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-stretch select-none">
      
      {/* Background glow lines using soft white / grey instead of Cyan */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.01] blur-3xl rounded-full"></div>
 
      {/* Main Turntable Disk Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black border border-white/5 rounded-2xl p-6 relative">
        
        {/* Dynamic Equalizer / Vinyl Meter in pure white */}
        <div className="absolute top-4 left-4 flex gap-1 items-end h-8">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-white rounded-t"
              animate={{
                height: isPlaying ? [4, 24, 8, 30, 12, 4][(i + Math.round(rotation / 45)) % 6] : 4
              }}
              transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: 'easeInOut' }}
            />
          ))}
        </div>
 
        {/* BPM and Status Indicator Overlay in stark mono */}
        <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[10px] bg-[#111] px-3.5 py-1.5 border border-white/10 text-white shadow-lg">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-white animate-ping' : 'bg-white/20'}`}></span>
          <span className="font-bold tracking-widest">{currentBpm} BPM</span>
        </div>
 
        {/* Interactive Spinning Platter */}
        <div 
          ref={turntableRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{ cursor: isScratching ? 'grabbing' : 'grab' }}
          className="relative w-72 h-72 md:w-80 md:h-80 rounded-full bg-[#111111] shadow-[0_0_60px_rgba(0,0,0,0.95)] border-[8px] border-[#1a1a1a] flex items-center justify-center transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] my-6"
        >
          {/* Tone-Arm Representation - sleek gray/black */}
          <div 
            className="absolute -top-6 -right-2 w-32 h-44 pointer-events-none transition-transform duration-700 origin-top"
            style={{
              transform: isPlaying 
                ? 'rotate(24deg) translate(-10px, 80px)' 
                : 'rotate(0deg) translate(0px, 0px)',
              zIndex: 10
            }}
          >
            {/* Base */}
            <div className="absolute top-0 right-10 w-12 h-12 rounded-full bg-[#1c1c1c] border-4 border-black shadow-inner"></div>
            {/* Tone-Arm metallic rod */}
            <div className="absolute top-6 right-[3.4rem] w-1.5 h-36 bg-gradient-to-b from-neutral-500 to-neutral-700 rounded-full origin-top"></div>
            {/* Tone-Arm headshell cartridge */}
            <div className="absolute top-36 right-[2.9rem] w-4 h-6 bg-[#222222] rounded border border-neutral-700 shadow-md">
              <div className="w-1 h-3 bg-white mx-auto mt-1 rounded-sm"></div>
            </div>
          </div>
 
          {/* Strobe Dots Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-white/5 opacity-50"></div>
          <div className="absolute inset-4 rounded-full border border-dashed border-white/10 opacity-30"></div>
 
          {/* Vinyl Record */}
          <div 
            style={{ transform: `rotate(${rotation}deg)` }}
            className="w-[94%] h-[94%] rounded-full bg-gradient-to-r from-neutral-950 via-black to-neutral-950 shadow-2xl relative flex items-center justify-center"
          >
            {/* Concentric Vinyl grooves styling */}
            <div className="absolute inset-4 rounded-full border border-neutral-900/60"></div>
            <div className="absolute inset-8 rounded-full border border-neutral-900/40"></div>
            <div className="absolute inset-12 rounded-full border border-neutral-900/80"></div>
            <div className="absolute inset-16 rounded-full border border-neutral-900/40"></div>
            <div className="absolute inset-20 rounded-full border border-neutral-900/80"></div>
            <div className="absolute inset-24 rounded-full border border-neutral-900/55"></div>
 
            {/* Glossy vinyl light reflection overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/5 to-transparent pointer-events-none rounded-full"></div>
 
            {/* Custom Record Label Center Card matching the album style desaturated vibe */}
            <div className="w-28 h-28 rounded-full bg-neutral-900 flex flex-col items-center justify-center relative p-2 shadow-inner border-[3px] border-black">
              <Disc className="w-8 h-8 text-white opacity-40 animate-spin-slow duration-[8s]" />
              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-white mt-1">LE BON</span>
              <span className="text-[7px] font-mono font-medium text-white/40 mt-0.5">STEREO 33⅓</span>
              
              {/* Spindle hole */}
              <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-black border-2 border-neutral-600 shadow-inner"></div>
            </div>
          </div>
        </div>
 
        {/* Action Controls for Vinyl */}
        <div className="flex gap-4 mt-2 justify-center w-full max-w-xs">
          <button 
            id="vin-play-btn"
            onClick={() => {
              initAudio();
              onTogglePlay();
            }}
            className={`flex-1 py-3 px-5 rounded-full font-bold tracking-[0.2em] uppercase text-[10px] flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-white border-white text-black font-extrabold' 
                : 'bg-transparent border-white/20 text-gray-300 hover:border-white hover:text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> PAUSE DECK
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> START DECK
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              initAudio();
              setSpeedMode(prev => prev === 33 ? 45 : 33);
            }}
            className="bg-[#111] text-gray-400 hover:text-white hover:border-white/30 border border-white/10 px-4 rounded-full font-mono text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle RPM speeds"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{speedMode} RPM</span>
          </button>
        </div>
      </div>
 
      {/* Side EQ Mixer Desk Controls */}
      <div className="w-full md:w-56 bg-black border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
        
        {/* Pitch Slider section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
            <span className="text-gray-500">PITCH LEVEL</span>
            <span className={`${pitch === 0 ? 'text-gray-400' : 'text-white'}`}>
              {pitch >= 0 ? `+${pitch}` : pitch}%
            </span>
          </div>
 
          <div className="relative flex items-center h-44 bg-[#111] rounded-xl border border-white/10 py-4 px-3">
            {/* Center Zero notch marker */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 pointer-events-none flex items-center justify-end pr-2 text-[8px] font-mono text-gray-500">ZERO</div>
            
            {/* Vertical pitch slider track */}
            <input
              type="range"
              min="-8"
              max="8"
              step="1"
              value={pitch}
              onChange={(e) => {
                initAudio();
                setPitch(parseInt(e.target.value));
              }}
              style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
              className="w-full h-full accent-white opacity-80 hover:opacity-100 cursor-ns-resize bg-transparent"
            />
          </div>
 
          <button 
            onClick={() => {
              initAudio();
              setPitch(0);
            }}
            disabled={pitch === 0}
            className={`w-full py-2 px-3 rounded-full text-[9px] font-mono tracking-widest border transition-all cursor-pointer ${
              pitch !== 0 
                ? 'bg-neutral-900 text-white border-white/20 hover:bg-white hover:text-black' 
                : 'text-neutral-700 border-neutral-900 pointer-events-none'
            }`}
          >
            RESET RANGE
          </button>
        </div>
 
        {/* Mixer Level Knobs */}
        <div className="flex flex-col gap-3.5 pt-4 border-t border-white/5 mt-4">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
            <span className="text-gray-500">CROSSFADER</span>
            <span className="text-white">{crossfader}%</span>
          </div>
          
          {/* Slider input */}
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max="100"
              value={crossfader}
              onChange={(e) => {
                initAudio();
                setCrossfader(parseInt(e.target.value));
              }}
              className="w-full accent-white bg-[#111] rounded-lg appearance-none h-1.5 cursor-ew-resize"
            />
            <div className="flex justify-between text-[8px] text-gray-600 font-mono mt-1">
              <span>DECK A</span>
              <span>CENTER</span>
              <span>DECK B</span>
            </div>
          </div>
 
          <div className="flex justify-between items-center text-[10px] font-mono pt-2">
            <span className="text-gray-500">BEAT SLIP</span>
            <button
              onClick={() => {
                initAudio();
                setSlipMode(prev => !prev);
              }}
              className={`px-3 py-1 text-[9px] tracking-widest uppercase font-bold rounded-full ${
                slipMode 
                  ? 'bg-white text-black font-extrabold border border-white' 
                  : 'bg-[#111] border border-white/10 text-gray-500 hover:border-white/30 cursor-pointer'
              }`}
            >
              {slipMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
 
      </div>
    </div>
  );
}
