import React from 'react';
import { Radio, ExternalLink, Sparkles, Disc } from 'lucide-react';

export default function MixcloudFeed() {
  return (
    <div id="mixcloud-section" className="flex flex-col gap-6">
      
      {/* Title & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="font-mono text-[9px] font-bold text-white/40 tracking-[0.4em] uppercase flex items-center gap-2">
            <Radio className="w-3 h-3 text-white/60 animate-pulse" />
            <span>02 / CLOUD ARCHIVE SYNDICATION</span>
          </span>
          <h3 className="text-3xl font-black font-display text-white mt-2 uppercase tracking-tight">
            MIXCLOUD BROADCAST DECK
          </h3>
          <p className="text-xs text-gray-400 font-sans mt-1.5 tracking-wide uppercase opacity-70">
            PREVIEW AND STREAM THE COMPLETE CHRONOLOGY DIRECT FROM THE ERIC LE BON STUDIO FEED.
          </p>
        </div>

        {/* Action Button to visit profile */}
        <a
          href="https://www.mixcloud.com/EricLeBon/"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-transparent border border-white/10 hover:border-white hover:bg-white hover:text-black rounded-full flex items-center gap-2 transition duration-300 font-bold tracking-[0.2em] text-[10px] uppercase text-gray-300 hover:scale-105 self-start sm:self-auto cursor-pointer"
        >
          <span>FOLLOW ON MIXCLOUD</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Embed Container and Meta Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Interactive Broadcast Widget */}
        <div className="lg:col-span-8 bg-black border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white"></div>
          
          <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.2em] text-white/60 mb-4 uppercase font-mono">
            <span>LIVE MIXCLOUD CONSOLE FEED</span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded border border-white/10 text-[9px] tracking-widest text-[#a3a3a3]">
              ● TRANSMITTING
            </span>
          </div>

          <div className="relative w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/5 min-h-[400px] md:min-h-[450px]">
            {/* Mixcloud dynamic dark player widget */}
            <iframe
              width="100%"
              height="450"
              src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=0&light=0&feed=%2FEricLeBon%2F"
              frameBorder="0"
              title="DJ Eric Le Bon Mixcloud Feed"
              className="absolute inset-0 w-full h-full border-none"
              allow="autoplay"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
            <span>STREAM ARCHIVE SYSTEM ACTIVE</span>
            <span>POWERED BY MIXCLOUD SYNDICATE</span>
          </div>
        </div>

        {/* Right Side: Informational Context/Rider Note Panel */}
        <div className="lg:col-span-4 bg-transparent border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.3em] pb-3 border-b border-white/10">
              BROADCAST DETAILS
            </h4>
            
            <p className="text-xs text-gray-400 font-sans leading-relaxed uppercase tracking-wide opacity-80">
              OUR SYNDICATED FEED SYNCHRONIZES YOUR LISTENING CONTEXT DIRECT WITH THE GLOBAL DJ MIXCLOUD PLATFORM. EXPLORE AN EXTENDED ARRAY OF OVERGROUND SELECTIONS, RAW LIVE RECORDINGS, AND SPECIAL RESIDENCY CURATIONS.
            </p>

            <div className="space-y-4 font-mono text-[10px]">
              <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-lg flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-white/70 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white text-[11px] tracking-wider uppercase">MOBILE SYNCED</p>
                  <p className="text-gray-500 text-[9px] uppercase leading-relaxed tracking-wider">
                    COMPATIBLE WITH APPLE MUSIC, GOOGLE PLAY AND MOBILE MIXCLOUD CONTROLLERS FOR OFF-GRID SESSIONS.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-lg flex items-start gap-3">
                <Disc className="w-4 h-4 text-white/70 flex-shrink-0 mt-0.5 animate-spin-slow" />
                <div className="space-y-1">
                  <p className="font-bold text-white text-[11px] tracking-wider uppercase">HIGH END DECIBELS</p>
                  <p className="text-gray-500 text-[9px] uppercase leading-relaxed tracking-wider">
                    STREAMS TRANSMITTED AT 320KBPS MP3/AAC HQ DIGITAL MATRIX PRESET AUDIO DYNAMICS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 text-[9px] font-mono text-gray-500 tracking-wide uppercase opacity-70 leading-normal">
            * MIXCLOUD COMPILING LOGS RETREIVED ON-THE-FLY. REGISTER FOR GIG CHANNELS ABOVE.
          </div>
        </div>

      </div>

    </div>
  );
}
