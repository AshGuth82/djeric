import React, { useState } from 'react';
import Hero from './components/Hero';
import Turntable from './components/Turntable';
import BookingForm from './components/BookingForm';
import MixcloudFeed from './components/MixcloudFeed';
import { Shield, Sparkles, Disc, Radio, Sliders, Calendar, Mail, FileText, Youtube, Music, Instagram } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBpm, setCurrentBpm] = useState<number>(124);

  const handleTogglePlay = (forceState?: boolean) => {
    if (forceState !== undefined) {
      setIsPlaying(forceState);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans antialiased overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* 1. Header Navigation Bar (Bold Typography Minimal Layout) */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 z-[100] transition-colors">
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
          
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition duration-300">
              <Disc className="w-4 h-4 text-white group-hover:text-black animate-spin-slow" />
            </div>
            <div>
              <span className="font-display font-black text-xs uppercase tracking-[0.25em] text-white">
                ERIC LE <span className="text-stroke-white text-transparent">BON</span>
              </span>
              <span className="block text-[8px] font-mono text-gray-500 tracking-[0.3em] uppercase leading-none mt-0.5">ARTIST PROFILE</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-10 text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 select-none">
            <button
              onClick={() => handleScrollToSection('deck-section')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Console
            </button>
            
            <button
              onClick={() => handleScrollToSection('mixcloud-section')}
              className="hover:text-white cursor-pointer transition-colors animate-pulse text-white/90"
            >
              Broadcast
            </button>

            <button
              onClick={() => handleScrollToSection('bookings-section')}
              className="hover:text-white cursor-pointer transition-colors font-bold text-white"
            >
              Booking
            </button>
          </nav>

          <button
            onClick={() => handleScrollToSection('bookings-section')}
            className="px-5 py-2.5 bg-white text-black hover:bg-black hover:text-white border border-white text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
          >
            Inquire
          </button>

        </div>
      </header>

      {/* 2. Hero cinematic entry */}
      <section className="bg-transparent">
        <Hero />
      </section>

      {/* 3. Main interactive segments wrapper with safe padding grids */}
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-32">
        
        {/* INTERACTIVE TURNTABLE UNIT */}
        <section className="space-y-6" id="deck-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-[9px] font-bold text-white/40 tracking-[0.4em] uppercase">
                01 / ANALOG SYNTH INTERACTION
              </span>
              <h2 className="text-3xl font-black font-display text-white mt-2 uppercase tracking-tight">
                DYNAMIC CONTROLLER CONSOLE
              </h2>
            </div>
            <p className="text-[12px] text-gray-400 font-sans max-w-sm md:text-right leading-relaxed tracking-wide opacity-80 uppercase">
              Drag on platter to scratch record, adjust the pitch slider, or toggle speed in real time.
            </p>
          </div>

          <Turntable
            currentBpm={currentBpm}
            onBpmChange={setCurrentBpm}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
          />
        </section>

        {/* MIXCLOUD PROFILE INTEGRATION */}
        <section className="scroll-mt-28" id="mixcloud-section">
          <MixcloudFeed />
        </section>

        {/* FORM INQUIRIES & CONTACTS */}
        <section className="scroll-mt-28" id="bookings-section">
          <div className="border-b border-white/10 pb-6 mb-8">
            <span className="font-mono text-[9px] font-bold text-white/40 tracking-[0.4em] uppercase">
              03 / WORLD ENGAGEMENTS
            </span>
            <h2 className="text-3xl font-black font-display text-white mt-1.5 uppercase tracking-tight">
              BOOKING ENQUIRIES
            </h2>
          </div>
          
          <BookingForm />
        </section>

      </main>

      {/* 4. Footer credits with legal tags */}
      <footer className="bg-[#030303] border-t border-white/10 py-16 mt-32">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-10 items-center text-center md:text-left select-none">
          
          {/* Logo trace */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-[900] text-sm tracking-[0.3em] uppercase text-white">
                ERIC LE <span className="text-transparent text-stroke-white">BON</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-sans max-w-xs leading-relaxed tracking-wide uppercase opacity-70">
              Official portfolio. Blending premium house and deep technological sets for upscale beach spots and underground clubs globally.
            </p>
          </div>

          {/* Social connections */}
          <div className="md:col-span-4 flex flex-col items-center gap-4">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-[0.4em]">CONNECT WITH ERIC</span>
            <div className="flex gap-4">
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white flex items-center justify-center transition duration-300 cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://soundcloud.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white flex items-center justify-center transition duration-300 cursor-pointer"
              >
                <Music className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white flex items-center justify-center transition duration-300 cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Copyright legal details */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end gap-2 text-[10px] text-gray-500 font-mono tracking-wider">
            <span>&copy; {new Date().getFullYear()} DJ ERIC LE BON. ALL RIGHTS RESERVED.</span>
            <span className="text-[8px] tracking-[0.2em] font-bold text-white/40 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> SECURED BY PUSH AGENCY PARIS
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
