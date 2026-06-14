import React, { useState, useEffect } from 'react';
import { Mix } from './types';
import Hero from './components/Hero';
import Turntable from './components/Turntable';
import MixPlayer from './components/MixPlayer';
import BookingForm from './components/BookingForm';
import MixcloudFeed from './components/MixcloudFeed';
import { Shield, Sparkles, Disc, Radio, Sliders, Calendar, Mail, FileText, Youtube, Music, Instagram } from 'lucide-react';
import { motion } from 'motion/react';

// Static Premium Mixes Showcase Data
const INITIAL_MIXES: Mix[] = [
  {
    id: 'mix-sunset-ibiza',
    title: 'Neon Horizon Sunset (Live at Cafe Del Mar)',
    genre: 'Deep House / Organic',
    duration: '58:24',
    bpm: 121,
    releaseDate: 'May 2026',
    description: 'Evocative Sunset session. Features hypnotic warm synth pads, rhythmic sub-bass grooves, and a vocal transition of timeless French underground melodies.',
    audioUrl: '',
    tracklist: [
      'Eric Le Bon - Intro Chords & Organic Waves (0:00)',
      'Black Coffee - Gardens of Eden (Le Bon Remix) (8:45)',
      'Rampa, Keinemusik - Les Gouttes (Extended Blend) (18:12)',
      'Guy Gerber - Sunset Shadows (Vocal edit) (32:40)',
      'Stimming - Alpe Lusia (48:15)',
      'Eric Le Bon - Outro Sunrise (56:00)'
    ]
  },
  {
    id: 'mix-berlin-techno',
    title: 'Nocturnal Pulse (Watergate Berlin Live set)',
    genre: 'Melodic Techno',
    duration: '1:12:15',
    bpm: 126,
    releaseDate: 'April 2026',
    description: 'A deep, cerebral modular techno trek captured raw in the legendary glassroom overlooking the Spree river. Dark, modular, and industrial.',
    audioUrl: '',
    tracklist: [
      'Stephan Bodzin - Tron (Live performance intro) (0:00)',
      'Tale Of Us - Astral Echo (11:20)',
      'Maceo Plex - Conjure Dreams (Berlin Mix) (24:45)',
      'Eric Le Bon - Quantum Resonance (Synthesizer Jam) (39:10)',
      'Ben Böhmer - Beyond Beliefs (Progressive beat) (52:30)',
      'ARTBAT - Horizon Echoes (1:07:45)'
    ]
  },
  {
    id: 'mix-disco-vocals',
    title: 'Sultry Cabaret & French Nu-Disco Session',
    genre: 'Nu-Disco / French-Touch',
    duration: '44:10',
    bpm: 118,
    releaseDate: 'February 2026',
    description: 'A tribute to the iconic French-Touch disco house scene. Highly energetic brass chords, funky bass guitars, and filtered 909 drum machines.',
    audioUrl: '',
    tracklist: [
      'Cassius - Feeling For You (Eric Le Bon Edit) (0:00)',
      'Daft Punk - Voyager (French Retro Remaster) (6:40)',
      'Folamour - Devoted To Yesterdays (15:20)',
      'Breakbot - Baby I\'m Yours (Instrumental Cut) (24:10)',
      'Fred Falke - Love Sunset (35:50)'
    ]
  },
  {
    id: 'mix-afro-shamanic',
    title: 'Tribal Shamanic Afro-House Journey',
    genre: 'Afro-House',
    duration: '1:04:30',
    bpm: 123,
    releaseDate: 'January 2026',
    description: 'Warm hand-percussions and wooden flutes woven with dark analog synthesis to create a deeply grounding, rhythmic spiritual dancefloor flow.',
    audioUrl: '',
    tracklist: [
      'Pablo Fierro - Tembo (Tribal Intro) (0:00)',
      '&ME - Garden (Shamanic rework) (12:30)',
      'Moojo, Caiiro - Here We Are (26:40)',
      'Ameme - Kaleta (Vocal blend) (40:15)',
      'Eric Le Bon - Conga Drums Live Jam (53:45)'
    ]
  }
];



export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeMix, setActiveMix] = useState<Mix>(INITIAL_MIXES[0]);
  const [currentBpm, setCurrentBpm] = useState<number>(activeMix.bpm);

  // Sync Turntable BPM when active mix changes
  useEffect(() => {
    setCurrentBpm(activeMix.bpm);
  }, [activeMix]);

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
              onClick={() => handleScrollToSection('mixes-section')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Archive
            </button>

            <button
              onClick={() => handleScrollToSection('mixcloud-section')}
              className="hover:text-white cursor-pointer transition-colors"
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

        {/* LATEST RECORDED MIXES CONTAINER */}
        <section className="scroll-mt-28 space-y-4" id="mixes-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-[9px] font-bold text-white/40 tracking-[0.4em] uppercase">
                02 / ARCHIVE SELECTIONS
              </span>
              <h2 className="text-3xl font-black font-display text-white mt-1.5 uppercase tracking-tight">
                LATEST RECORDINGS
              </h2>
            </div>
          </div>
          
          <MixPlayer
            mixes={INITIAL_MIXES}
            activeMix={activeMix}
            setActiveMix={setActiveMix}
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
              04 / WORLD ENGAGEMENTS
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
