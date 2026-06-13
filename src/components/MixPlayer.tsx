import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, List, Share2, Sparkles, Clock, Music4, Download } from 'lucide-react';
import { Mix } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MixPlayerProps {
  mixes: Mix[];
  activeMix: Mix;
  setActiveMix: (mix: Mix) => void;
  isPlaying: boolean;
  onTogglePlay: (state?: boolean) => void;
}

export default function MixPlayer({
  mixes,
  activeMix,
  setActiveMix,
  isPlaying,
  onTogglePlay,
}: MixPlayerProps) {
  const [currentTime, setCurrentTime] = useState<number>(1042); // simulated context time start (approx 17 mins in raw seconds)
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTracklist, setShowTracklist] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const playProgressRef = useRef<number>(1042);

  // Parse duration string into total seconds for playback calculation
  const getDurationInSeconds = (durationStr: string) => {
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parts[0] * 60 + parts[1];
  };

  const totalSeconds = getDurationInSeconds(activeMix.duration);

  // Time progress simulator loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds) {
            // loop or stop
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  // Format digital clock time (HH:MM:SS or MM:SS)
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = Math.floor(secs % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(remainingSecs)}`;
    }
    return `${pad(mins)}:${pad(remainingSecs)}`;
  };

  const progressPercentage = (currentTime / totalSeconds) * 100;

  // Real-time canvas waveform visualizer drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 70);

    // Keep dimensions sharp
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const barCount = 68;
      const barWidth = (width / barCount) - 2;
      const waveAmplitude = isPlaying ? 24 : 3;

      phase += isPlaying ? 0.04 : 0.005;

        for (let i = 0; i < barCount; i++) {
        // Create an organic double-sine soundwave contour
        const progressX = i / barCount;
        const normX = Math.sin(progressX * Math.PI); // arch envelope (0 to 1 back to 0)
        
        // Multi-frequency wave formula
        const f1 = Math.sin(progressX * 8 - phase) * waveAmplitude;
        const f2 = Math.cos(progressX * 18 + phase * 1.5) * (waveAmplitude / 2);
        const noise = (Math.random() - 0.5) * (isPlaying ? 5 : 0.5);

        // Calculate combined height bounded with noise
        let val = Math.abs(f1 + f2 + noise) * normX + 3;
        
        // Highlights the current playing progress
        const isPastBar = progressX * 100 <= progressPercentage;
        
        // Color gradient setup - Monochrome
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        if (isPastBar) {
          grad.addColorStop(0, '#ffffff'); // crisp white
          grad.addColorStop(1, '#a3a3a3'); // pure light gray
        } else {
          grad.addColorStop(0, '#262626'); // dark coal gray
          grad.addColorStop(1, '#171717'); // obsidian gray
        }

        ctx.fillStyle = grad;
        
        // Draw double symmetrically from center horizontal axis
        const cy = height / 2;
        ctx.beginPath();
        ctx.roundRect(
          i * (barWidth + 2), 
          cy - val / 2, 
          barWidth, 
          val, 
          1.5
        );
        ctx.fill();
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Resize observer
    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 70;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, progressPercentage]);

  // Next / Previous action handlers
  const handleNext = () => {
    const currentIndex = mixes.findIndex((m) => m.id === activeMix.id);
    const nextIndex = (currentIndex + 1) % mixes.length;
    setActiveMix(mixes[nextIndex]);
    setCurrentTime(0);
    onTogglePlay(true);
  };

  const handlePrev = () => {
    const currentIndex = mixes.findIndex((m) => m.id === activeMix.id);
    const prevIndex = (currentIndex - 1 + mixes.length) % mixes.length;
    setActiveMix(mixes[prevIndex]);
    setCurrentTime(0);
    onTogglePlay(true);
  };

  // Skip progress bar click handler
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercentage = clickX / rect.width;
    setCurrentTime(Math.floor(clickPercentage * totalSeconds));
  };

  // Simulated share handler
  const [copiedLink, setCopiedLink] = useState(false);
  const handleShare = (mixName: string) => {
    const dummyUrl = `${window.location.origin}/#/mix/${activeMix.id}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div id="mixes-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* 1. Left side list: Showcase of DJ Mixes */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h3 className="text-sm font-bold font-mono tracking-[0.4em] uppercase text-white/50 mb-4 flex items-center gap-2">
          <span>SELECTIVE JOURNAL CHRONICLES</span>
        </h3>

        {mixes.map((mix) => {
          const isActive = mix.id === activeMix.id;
          return (
            <div
              key={mix.id}
              className={`p-5 rounded-2xl border transition-all duration-350 cursor-pointer select-none flex flex-col ${
                isActive
                  ? 'bg-white/[0.03] border-white/20 shadow-2xl'
                  : 'bg-transparent border-white/5 hover:border-white/20 hover:bg-white/[0.01]'
              }`}
              onClick={() => {
                setActiveMix(mix);
                if (!isActive) {
                  setCurrentTime(0);
                  onTogglePlay(true);
                }
              }}
            >
              <div className="flex gap-4 items-center">
                {/* Visual Cover Placeholder Seeded by genre */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={`https://picsum.photos/seed/${mix.genre.replace(' ', '')}/150/150`}
                    alt={mix.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale"
                  />
                  <div className="absolute inset-0 bg-neutral-900/40 mix-blend-color"></div>
                  {isActive && isPlaying ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="flex gap-1.5 items-end justify-center h-4">
                        <span className="w-1 bg-white rounded-t h-3 animate-pulse"></span>
                        <span className="w-1 bg-white rounded-t h-4 animate-ping"></span>
                        <span className="w-1 bg-white rounded-t h-2 animate-bounce"></span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                      <Play className="w-5 h-5 fill-white pb-0.5" />
                    </div>
                  )}
                </div>

                {/* Text Metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1 pb-1">
                    <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/50 font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      {mix.genre}
                    </span>
                    <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-600" /> {mix.duration}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-gray-100 uppercase tracking-tight truncate pr-4">
                    {mix.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 font-sans tracking-wide">
                    {mix.description}
                  </p>
                </div>
              </div>

              {/* Extra Expandable details for selected set */}
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden mt-4 pt-4 border-t border-dashed border-white/10"
                >
                  <div className="flex flex-col gap-3 bg-white/[0.01] p-4 border border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.2em] text-white/60 mb-1 uppercase">
                      <span className="flex items-center gap-1.5 font-mono">
                        TRACKLIST CHRONOLOGY
                      </span>
                      <span className="font-mono text-white text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        SET SPEED: {mix.bpm} BPM
                      </span>
                    </div>
                    
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-400 font-mono tracking-wide">
                      {mix.tracklist.map((track, idx) => (
                        <li key={idx} className="truncate hover:text-white transition-colors">
                          <span className="text-gray-300 pl-1">{track}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(mix.title);
                        }}
                        className="flex-grow py-2 bg-transparent border border-white/10 text-gray-300 hover:text-white hover:border-white rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer font-bold tracking-[0.2em] text-[9px] uppercase"
                      >
                        <Share2 className="w-3.5 h-3.5 text-white/50" />
                        <span>{copiedLink ? 'COPIED LINK!' : 'SHARE LINK'}</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // mock download click
                          alert(`Starting offline digital high-res download for set: "${mix.title}". (Promotional Copy)`);
                        }}
                        className="px-5 bg-white text-black hover:bg-black hover:text-white border border-white rounded-full flex items-center justify-center gap-2 transition duration-300 font-bold tracking-[0.2em] text-[9px] uppercase cursor-pointer"
                        title="Download MP3 Promomix"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">DOWNLOAD MP3</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Right side player: Master sound wave visualization console & Active mix details */}
      <div className="lg:col-span-5 bg-black border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between self-start">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white"></div>

        <div>
          {/* Cover Art / Title visual desaturated */}
          <div className="relative aspect-video overflow-hidden bg-neutral-950 border border-white/5 rounded-xl flex items-center justify-center mb-6 group">
            <img
              src={`https://picsum.photos/seed/${activeMix.genre.replace(' ', '')}/600/350`}
              alt={activeMix.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 opacity-30 group-hover:scale-105 transition-transform duration-[6s]"
            />
            
            {/* Visual audio grid blur */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>

            <div className="relative text-center p-4 z-10 flex flex-col items-center">
              <span className="text-[9px] font-mono tracking-[0.3em] text-white/60 bg-white/5 px-3.5 py-1 uppercase border border-white/10 mb-4 block">
                NOW CASTING
              </span>
              <h4 className="font-display font-[900] text-lg text-white tracking-tight uppercase line-clamp-2 leading-tight">
                {activeMix.title}
              </h4>
              <p className="text-[10px] text-gray-400 font-mono mt-2 font-semibold uppercase tracking-[0.2em]">
                {activeMix.genre} STUDIO RECORDING
              </p>
            </div>
          </div>

          {/* Master sound wave canvas visualizer */}
          <div className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl mb-6 flex flex-col justify-center min-h-[105px] relative">
            <canvas ref={canvasRef} className="w-full h-[70px]" />
          </div>

          {/* Progress bar scrub slider */}
          <div className="flex flex-col gap-2 select-none mb-6">
            <div 
              onClick={handleProgressBarClick}
              className="w-full h-1.5 bg-neutral-900 border border-white/5 cursor-pointer overflow-hidden relative"
            >
              <div 
                style={{ width: `${progressPercentage}%` }}
                className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] relative transition-all"
              />
            </div>
            
            <div className="flex justify-between text-[11px] font-mono text-gray-500">
              <span className="text-white/60">{formatTime(currentTime)}</span>
              <span className="text-gray-500 uppercase tracking-wider flex items-center gap-1">
                Total {activeMix.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Playback controller switches */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            
            {/* Nav controls */}
            <div className="flex gap-2 items-center">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-transparent hover:bg-white/5 border border-white/10 hover:border-white text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Prev mix"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onTogglePlay()}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-white text-black font-bold scale-105 shadow-inner'
                    : 'bg-transparent border border-white text-white hover:bg-white hover:text-black hover:scale-105'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-transparent hover:bg-white/5 border border-white/10 hover:border-white text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Next mix"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Volume controls */}
            <div className="flex items-center gap-2 flex-1 max-w-[150px]">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-white/40" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-white h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
              />
            </div>

          </div>

          <p className="text-[9px] text-gray-500 font-mono text-center flex items-center justify-center gap-1 uppercase tracking-wider pl-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1"></span>
            ACTIVE AMPLIFICATION ENGINE · ADJUST BPM VIA UPPER TURNTABLE UNIT
          </p>
        </div>

      </div>
    </div>
  );
}
