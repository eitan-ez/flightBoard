import React, { Component } from 'react';
import { Flight } from '../types/flight';
import { getFlights, deleteFlight } from '../services/flightApi';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import FlightRow from './FlightRow/FlightRow';
import AddFlight from './AddFlight/AddFlight';
import { FlightApiStatus } from '../types/flight';
import './FlightTable.css'; // Import the CSS file

export enum State {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}

interface FlightTableProps {
}

interface FlightTableState {
  flights: Flight[];
  status: State;
  errorMessage: string | null;
  filterDestination: string;
  filterStatus: string;
}

class FlightTable extends Component<FlightTableProps, FlightTableState> {
  private intervalId?: NodeJS.Timeout;

  constructor(props: FlightTableProps) {
    super(props);
    this.state = {
      flights: [],
      status: State.IDLE,
      errorMessage: null,
      filterDestination: '',
      filterStatus: '',
    };
  }

  private formatDateTime = (dateTimeString: string | number | Date): string => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  fetchFlightsData = async (statusParam?: string, destination?: string) => {
    this.setState({ status: State.LOADING, errorMessage: null });
    try {
      const currentDestination = destination !== undefined ? destination : this.state.filterDestination;
      const currentStatus = statusParam !== undefined ? statusParam : this.state.filterStatus;

      const data = await getFlights(currentStatus || undefined, currentDestination || undefined);
      this.setState({ flights: data, status: State.SUCCESS });
    } catch (err) {
      if (err instanceof Error) {
        this.setState({ errorMessage: err.message, status: State.ERROR });
      } else {
        this.setState({ errorMessage: 'An unknown error occurred fetching flights', status: State.ERROR });
      }
    }
  };

  componentDidMount() {
    this.fetchFlightsData();
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  handleDeleteFlight = async (flightNumberToDelete: string) => {
    try {
      await deleteFlight(flightNumberToDelete);
      this.setState(prevState => ({
        flights: prevState.flights.filter(flight => flight.flightNumber !== flightNumberToDelete)
      }));
    } catch (err) {
      console.error("Failed to delete flight:", flightNumberToDelete, err);
      if (err instanceof Error) {
        this.setState({ errorMessage: `Failed to delete flight ${flightNumberToDelete}: ${err.message}`, status: State.ERROR });
      } else {
        this.setState({ errorMessage: `Failed to delete flight ${flightNumberToDelete}`, status: State.ERROR });
      }
    }
  };

  handleFlightAdded = () => {
    this.fetchFlightsData();
  };

  handleFilterInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value } as unknown as Pick<FlightTableState, 'filterDestination' | 'filterStatus'>);
  };

  handleFilterSubmit = () => {
    this.fetchFlightsData();
  };

  handleClearFilters = () => {
    this.setState({
      filterDestination: '',
      filterStatus: '',
    }, () => {
      this.fetchFlightsData();
    });
  };

  render() {
    const { flights, status, errorMessage, filterDestination, filterStatus } = this.state;

    if (status === State.LOADING && flights.length === 0) {
      return (
        <Box className="centeredStatusBox">
          <CircularProgress />
        </Box>
      );
    }

    if (status === State.ERROR && flights.length === 0) {
      return (
        <Box className="centeredStatusBox">
          <Typography color="error">Error: {errorMessage}</Typography>
        </Box>
      );
    }

    return (
      <Box className="flightTableContainer">
        <Box className="flightTableContentWrapper">
          
          <Paper className="filterPaper">
            <TextField
              name="filterDestination"
              label="Filter by Destination City"
              value={filterDestination}
              onChange={this.handleFilterInputChange}
              variant="outlined"
              size="small"
              className="filterInput"
            />
            <FormControl variant="outlined" size="small" className="filterStatusSelect">
              <InputLabel id="filter-status-label">Filter by Status</InputLabel>
              <Select
                labelId="filter-status-label"
                name="filterStatus"
                value={filterStatus}
                onChange={this.handleFilterInputChange}
                label="Filter by Status"
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                {Object.values(FlightApiStatus).map((statusValue) => (
                  <MenuItem key={statusValue} value={statusValue}>
                    {statusValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={this.handleFilterSubmit}>Apply Filters</Button>
            <Button variant="outlined" onClick={this.handleClearFilters}>Clear Filters</Button>
          </Paper>

          {status === State.ERROR && flights.length > 0 && errorMessage && (
            <Box className="errorBox">
              <Typography variant="h6">Error loading flight data:</Typography>
              <Typography>{errorMessage}</Typography>
            </Box>
          )}
          <TableContainer component={Paper} className="tableDataContainer">
            <Table aria-label="flight table">
              <TableHead className="tableHeader">
                <TableRow>
                  <TableCell>Flight Number</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Departure Time</TableCell>
                  <TableCell>Gate</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flights.length === 0 && status === State.SUCCESS ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>No flights available.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  flights.map(flight => (
                    <FlightRow
                      key={flight.flightNumber}
                      flight={flight}
                      handleDeleteFlight={this.handleDeleteFlight}
                      formatDateTime={this.formatDateTime}
                    />
                  ))
                )}
                 {(status === State.LOADING && flights.length > 0) && (
                    <TableRow>
                        <TableCell colSpan={6} align="center">
                            <CircularProgress size={24} />
                            <Typography variant="caption" className="loadingMessageTypography">Updating flights...</Typography>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <AddFlight onFlightAdded={this.handleFlightAdded} />
      </Box>
    );
  }
}

export default FlightTable; 