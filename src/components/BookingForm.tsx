import React, { useState, useEffect } from 'react';
import { BookingSubmission } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle, Database, Trash2, Clock, Calendar, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BookingForm() {
  const [organizerName, setOrganizerName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [venueName, setVenueName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [eventType, setEventType] = useState<string>('Club Show');
  const [estimatedBudget, setEstimatedBudget] = useState<string>('€2,000 - €5,000');
  const [message, setMessage] = useState<string>('');
  
  const [submissions, setSubmissions] = useState<BookingSubmission[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('elb_guest_bookings');
      if (stored) {
        setSubmissions(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read local storage: ", e);
    }
  }, []);

  // Save submissions
  const saveSubmissions = (newSubs: BookingSubmission[]) => {
    setSubmissions(newSubs);
    try {
      localStorage.setItem('elb_guest_bookings', JSON.stringify(newSubs));
    } catch (e) {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerName || !email || !eventDate || !venueName || !location) return;

    const newInquiry: BookingSubmission = {
      id: `ELB-BK-${Math.floor(Math.random() * 10000)}`,
      organizerName,
      email,
      eventDate,
      venueName,
      location,
      eventType,
      estimatedBudget,
      message,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newInquiry, ...submissions];
    saveSubmissions(updated);
    
    // Clear form inputs
    setOrganizerName('');
    setEmail('');
    setEventDate('');
    setVenueName('');
    setLocation('');
    setMessage('');
    
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleDelete = (id: string) => {
    const filtered = submissions.filter(s => s.id !== id);
    saveSubmissions(filtered);
  };

  return (
    <div id="bookings-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* Left 4 Cols: Contact Details & Management Info */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-transparent border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          
          <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.3em] mb-4 border-b border-white/10 pb-3">
            REPRESENTATION DECK
          </h4>
          
          <p className="text-xs text-gray-400 font-sans leading-relaxed mb-6 uppercase tracking-wide opacity-80">
            FOR MAJOR FESTIVALS, GLOBAL AGENCY QUERIES, AND INTERNATIONAL GUEST PLACEMENTS, ENGAGE DIRECTLY WITH THE PLACEMENT GROUP AT PARIS AND BERLIN BRIDGES.
          </p>

          <div className="space-y-5">
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-white/85" />
              </div>
              <div>
                <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">General & Gigs</div>
                <a href="mailto:booking@ericlebon.com" className="text-xs text-gray-200 hover:text-white font-black transition">
                  booking@ericlebon.com
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-white/85" />
              </div>
              <div>
                <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">Press & Interviews</div>
                <a href="mailto:press@ericlebon.com" className="text-xs text-gray-200 hover:text-white font-black transition">
                  press@ericlebon.com
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-white/85" />
              </div>
              <div>
                <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">Agency Hotline</div>
                <span className="text-xs text-gray-200 font-black font-mono">
                  +33 (0) 1 42 27 75 00
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-white/85" />
              </div>
              <div>
                <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">Headquarters</div>
                <span className="text-xs text-gray-400 leading-normal font-sans tracking-wide">
                  Pulse Agency, Boulevard Voltaire, Paris, France
                </span>
              </div>
            </div>

          </div>

          {/* Electronic Rider Note */}
          <div className="mt-8 pt-5 border-t border-white/10 text-[10px] font-mono text-gray-500 flex gap-2.5">
            <HelpCircle className="w-4 h-4 text-white/60 flex-shrink-0" />
            <span className="leading-normal">RIDER PREFERS: 3x CDJ-3000, 1x DJM-V10 MIXER FRAME, AND INTEGRATED HIGH LEVEL MONITORING FEED.</span>
          </div>
        </div>

        {/* Display Submitted Bookings Traces */}
        {submissions.length > 0 && (
          <div className="bg-[#0b0b0b] border border-white/15 p-5">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-mono text-[9px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> FILED ENQUIRIES ({submissions.length})
              </h5>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-3.5 bg-black rounded-lg border border-white/5 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-sans font-bold text-gray-100 uppercase tracking-tight truncate max-w-[135px]">{sub.venueName}</span>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="text-gray-500 hover:text-white cursor-pointer transition-colors"
                      title="Delete inquiry record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="text-[10px] text-gray-400 font-mono flex justify-between items-center">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-neutral-600" /> {sub.eventDate}</span>
                    <span className="text-white bg-white/5 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest border border-white/10">
                      QUEUED
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-500 truncate mt-0.5 uppercase tracking-wider font-mono">
                    {sub.organizerName} · {sub.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right 8 Cols: Input inquiry Form */}
      <div className="lg:col-span-8 bg-transparent border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        
        <h4 className="text-lg font-display font-bold text-white uppercase tracking-tight mb-2">
          DIRECT PROP-SUBMISSION & RFP PITCH
        </h4>
        <p className="text-xs text-gray-400 font-sans mb-6 leading-normal uppercase tracking-wide opacity-80">
          PLANNING AN EVENT STAGE FOR ERIC? SPECIFY VENUE SCALE, SYSTEM AUDIO STANDARDS, AND BUDGET LEVELINGS below. Response expected inside hours.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">ORGANIZER / COMPANY PITCH</label>
            <input
              type="text"
              required
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="e.g., ZENITH PRODUCTIONS"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">CONTACT EMAIL COORDINATES</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR@DECKEMAIL.COM"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">TARGET GALA DATE</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-white cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">VENUE / SITE TITLE</label>
            <input
              type="text"
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="e.g., GLASS HANGAR ARENA"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-white"
            />
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">LOCATION (CITY, NATION)</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., PARIS, FR"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">EVENT STAGING SET</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-3 text-xs text-gray-300 focus:outline-none focus:border-white cursor-pointer uppercase"
              >
                <option>Club Gig Showcase</option>
                <option>Mainstage Festival Act</option>
                <option>Boilerroom Sunset Pool Party</option>
                <option>VIP Private Event</option>
                <option>Underground Rave Show</option>
              </select>
            </div>

            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">ARTIST INVESTMENT RANGE</label>
              <select
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-3 text-xs text-gray-300 focus:outline-none focus:border-white cursor-pointer uppercase"
              >
                <option>Under €2,000</option>
                <option>€2,000 - €5,000</option>
                <option>€5,000 - €10,000</option>
                <option>€10,000 - €25,000</option>
                <option>€25,000+ (Festival budget)</option>
              </select>
            </div>

          </div>

          <div className="sm:col-span-2">
            <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">RIDER NOTES / MEMO SUBMISSION</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., DESCRIBE YOUR AUDIO SYSTEM POWER, CAPACITY, EVENT HOUR SPANS, ETC."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm p-4 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-white resize-none"
            />
          </div>

          <div className="sm:col-span-2 flex justify-between items-center pt-4">
            <span className="text-[10px] font-mono text-gray-500 tracking-wide uppercase opacity-70">
              * GUEST VERIFICATIONS COMPILED IN ACCORDANCE WITH GDPR.
            </span>
            
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black hover:bg-neutral-900 hover:text-white border border-white font-bold rounded-full text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer transition duration-300"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SUBMIT PITCH</span>
            </button>
          </div>

        </form>

        {/* Floating toast notification for inquiries */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute bottom-4 right-4 bg-black border border-white/20 p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-sm z-30"
            >
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
              <div>
                <div className="text-xs font-bold font-mono tracking-widest text-white uppercase">PROPOSAL FILED SECURELY!</div>
                <div className="text-[10px] text-gray-400 font-sans mt-1 uppercase tracking-wide opacity-80 leading-relaxed">Recorded index on representation panel. Group will initiate email.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
