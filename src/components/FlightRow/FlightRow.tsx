import React from 'react';
import { Flight } from '../../types/flight';
import {
  TableRow,
  TableCell,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface FlightRowProps {
  flight: Flight;
  handleDeleteFlight: (flightNumber: string) => void;
  formatDateTime: (dateTimeString: string | number | Date) => string;
}

const FlightRow: React.FC<FlightRowProps> = ({ flight, handleDeleteFlight, formatDateTime }) => {
  return (
    <TableRow key={flight.flightNumber} hover>
      <TableCell>{flight.flightNumber}</TableCell>
      <TableCell>{`${flight.destination.city} (${flight.destination.airportCode})`}</TableCell>
      <TableCell>{formatDateTime(flight.originalDepartureTime)}</TableCell>
      <TableCell>{flight.gate}</TableCell>
      <TableCell>{flight.status}</TableCell>
      <TableCell>
        <Button onClick={() => handleDeleteFlight(flight.flightNumber)}>
          <DeleteIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default FlightRow; 