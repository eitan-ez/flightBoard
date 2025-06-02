export interface Destination {
  city: string;
  country: string;
  airportCode: string;
}

// Added Gate enum
export enum Gate {
  A1 = "A1", A2 = "A2", A3 = "A3", A4 = "A4", A5 = "A5", A6 = "A6", A7 = "A7",
  B1 = "B1", B2 = "B2", B3 = "B3", B4 = "B4", B5 = "B5", B6 = "B6", B7 = "B7",
  C1 = "C1", C2 = "C2", C3 = "C3", C4 = "C4", C5 = "C5", C6 = "C6", C7 = "C7"
}

export enum FlightApiStatus{
  SCHEDULED = "SCHEDULED",
  DELAYED = "DELAYED",
  CANCELLED = "CANCELLED",
  BOARDING = "BOARDING",
  DEPARTED = "DEPARTED",
  LANDED = "LANDED"
}
  

export interface Flight {
  // id?: string; // Temporarily removed as it's not in the GET response. We need to clarify how DELETE works.
  flightNumber: string;
  originalDepartureTime: string; // ISO string format for dates
  destination: Destination;
  gate: Gate; // Changed from string to Gate enum
  status: string; // Status from API (e.g., "SCHEDULED")
}

// For adding a new flight, we'd likely omit API-set fields like 'status'
// and 'id' if it were present.
export type NewFlight = Omit<Flight, 'status'>; 
// If flightNumber is not set by user but by API, Omit<'status' | 'flightNumber'> could also be possible.
