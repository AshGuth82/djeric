import React from 'react';
import { Sparkles, Music, Calendar, ChevronDown, Radio, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-28 pb-16 overflow-hidden flex flex-col justify-center items-center min-h-[90vh] text-center select-none">
      
      {/* 1. Extracting Ambient Blur Glares from the original design template */}
      <div className="absolute inset-0 opacity-40 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-blue-600/35 rounded-full blur-[120px] animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-purple-700/25 rounded-full blur-[100px] animate-pulse duration-[7s]"></div>
      </div>
      
      {/* 2. Sleek abstract grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] -z-10"></div>

      {/* 3. Main Brand Elements */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl px-4 flex flex-col items-center"
      >
        {/* Uppercase high tracking subtitled bar */}
        <div className="text-[11px] tracking-[0.6em] sm:tracking-[0.8em] uppercase opacity-60 mb-6 font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          <span>SONIC CURATOR & SOUND ARCHITECT</span>
        </div>

        {/* Colossal "Bold Typography" Header Element */}
        <h1 className="font-display font-[900] text-[75px] sm:text-[110px] md:text-[145px] lg:text-[170px] tracking-[-0.05em] leading-[0.85] text-center uppercase select-text selection:bg-white selection:text-black">
          <span className="text-white mix-blend-difference">ERIC</span>
          <br />
          <span className="text-transparent text-stroke-white opacity-95">LE BON</span>
        </h1>

        {/* DJ Philosophy with minimalist uppercase spacing */}
        <p className="mt-10 text-[13px] sm:text-sm md:text-md text-gray-300 font-sans max-w-xl font-normal leading-relaxed text-center select-text selection:bg-white selection:text-black tracking-wide opacity-80">
          GLOBAL SOUND-WEAVER CONDUCTING CEREBRAL DEEP-HOUSE BASSLINES, NOCTURNAL TECHNO LOOPS, AND EUPHORIC SUNSET NUANCES. PARISIAN HERITAGE, BERLIN DEPTH.
        </p>

        {/* Minimalist interactive stats border-y */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 border-y border-white/5 py-5 w-full max-w-xl mt-12 font-mono text-[10px] text-gray-400">
          <div className="group">
            <div className="text-white font-[800] text-xl font-display group-hover:scale-105 transition">12+</div>
            <div className="uppercase tracking-[0.2em] text-[8px] mt-1 opacity-50">YEARS EXCELLENCE</div>
          </div>
          <div className="group">
            <div className="text-white font-[800] text-xl font-display group-hover:scale-105 transition">400+</div>
            <div className="uppercase tracking-[0.2em] text-[8px] mt-1 opacity-50">CLUB SHOWSETS</div>
          </div>
          <div className="group">
            <div className="text-white font-[800] text-xl font-display group-hover:scale-105 transition">3</div>
            <div className="uppercase tracking-[0.2em] text-[8px] mt-1 opacity-50">GLOBAL RESIDENCIES</div>
          </div>
        </div>

        {/* Stark custom white border transition buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md">
          <button
            onClick={() => handleScrollTo('mixes-section')}
            className="flex-1 py-3 px-8 rounded-full bg-white hover:bg-black text-black hover:text-white border border-white font-bold text-[11px] tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-lg"
          >
            SHOWCASE MIXES
          </button>
          
          <button
            onClick={() => handleScrollTo('bookings-section')}
            className="flex-1 py-3 px-8 rounded-full bg-transparent hover:bg-white text-white hover:text-black border border-white/20 hover:border-white font-bold text-[11px] tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
          >
            BOOK SHOWSET
          </button>
        </div>
      </motion.div>

      {/* Mini biographical slide framed with minimal borders */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl px-4 mt-20 w-full"
      >
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left flex flex-col md:flex-row gap-6 items-center">
          
          <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0">
            <img 
              src="https://picsum.photos/seed/ericlebonprofile/200/200" 
              alt="DJ Eric Le Bon Portrait" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>

          <div className="flex-1 text-center md:text-left select-text">
            <span className="font-mono text-[9px] text-white font-bold tracking-[0.4em] uppercase opacity-40">ARTIST STATEMENT</span>
            <h3 className="font-display font-bold text-base text-white mt-1 uppercase">From French Underground to Ibiza Open Air</h3>
            <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed tracking-wide opacity-80">
              Eric began in the warehouse scenes of Paris before completing high-end residences in Watergate Berlin, Rex Club, and Ibiza. He weaves organic drum machines and synthesizers alongside custom live acapella stems to form a completely fluid soundscape that adapts instantly.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <button
              onClick={() => handleScrollTo('bookings-section')}
              className="w-full py-2.5 px-5 bg-white/5 hover:bg-white text-gray-300 hover:text-black border border-white/10 hover:border-white rounded-full text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition duration-300"
            >
              <span>QUICK INQUIRE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </motion.div>

      {/* Minimalist scroll helper */}
      <div 
        className="mt-14 flex flex-col items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-gray-500 hover:text-white cursor-pointer transition-colors"
        onClick={() => handleScrollTo('deck-section')}
      >
        <span>INTERACTIVE DECKS</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce text-white/40" />
      </div>

    </div>
  );
}
