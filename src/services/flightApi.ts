import { Flight, NewFlight } from '../types/flight';

const API_BASE_URL = '/api'; // Path for proxying

export const getFlights = async (status?: string, destinationCity?: string): Promise<Flight[]> => {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  if (destinationCity) queryParams.append('destinationCity', destinationCity);
  
  const response = await fetch(`${API_BASE_URL}/flights?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }
  return response.json();
};

export const addFlight = async (flight: NewFlight): Promise<Flight> => {
  const response = await fetch(`${API_BASE_URL}/flights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flight),
  });
  if (!response.ok) {
    // It might be good to parse the error response body if the API provides one
    throw new Error('Failed to add flight');
  }
  return response.json();
};

export const deleteFlight = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/flights/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete flight');
  }
}; 