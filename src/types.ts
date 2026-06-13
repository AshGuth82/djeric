export interface Mix {
  id: string;
  title: string;
  genre: string;
  duration: string;
  bpm: number;
  releaseDate: string;
  description: string;
  audioUrl: string; // fallback or test URL
  tracklist: string[];
}

export interface DJEvent {
  id: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  eventName: string;
  status: 'upcoming' | 'past';
  ticketStatus: 'available' | 'selling_fast' | 'sold_out' | 'private';
  ticketUrl?: string;
}

export interface BookingSubmission {
  id: string;
  organizerName: string;
  email: string;
  eventDate: string;
  venueName: string;
  location: string;
  eventType: string; // e.g., Club, Festival, Corporate, Private
  estimatedBudget: string;
  message: string;
  submittedAt: string;
}
