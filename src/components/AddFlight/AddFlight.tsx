import React, { Component } from 'react';
import { Gate, NewFlight } from '../../types/flight';
import { addFlight } from '../../services/flightApi';
import {
  Paper,
  Box,
  Typography,
  Button,
  Fab,
  TextField,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './AddFlight.css';

interface AddFlightProps {
  onFlightAdded: () => void;
}

interface AddFlightState {
  showAddFlightForm: boolean;
  newFlightNumber: string;
  newDestinationCity: string;
  newDestinationAirportCode: string;
  newDestinationCountry: string;
  newOriginalDepartureTime: string;
  newGate: Gate;
  addFlightError: string | null;
  isFabHovered: boolean;
  isAddingFlight: boolean;
  minDateTimeValue: string;
}

class AddFlight extends Component<AddFlightProps, AddFlightState> {
  constructor(props: AddFlightProps) {
    super(props);
    this.state = {
      showAddFlightForm: false,
      newFlightNumber: '',
      newDestinationCity: '',
      newDestinationAirportCode: '',
      newDestinationCountry: '',
      newOriginalDepartureTime: '',
      newGate: Gate.A1,
      addFlightError: null,
      isFabHovered: false,
      isAddingFlight: false,
      minDateTimeValue: this.getCurrentMinDateTime(),
    };
  }

  getCurrentMinDateTime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  handleAddFlightToggle = () => {
    const willShowForm = !this.state.showAddFlightForm;
    let newMinDateTime = this.state.minDateTimeValue;
    if (willShowForm) {
      newMinDateTime = this.getCurrentMinDateTime();
    }
    this.setState(prevState => ({
      showAddFlightForm: !prevState.showAddFlightForm,
      minDateTimeValue: newMinDateTime,
      addFlightError: null,
      newFlightNumber: '',
      newDestinationCity: '',
      newDestinationAirportCode: '',
      newDestinationCountry: '',
      newOriginalDepartureTime: '',
      newGate: Gate.A1,
      isAddingFlight: false,
    }));
  };

  handleNewFlightInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value } as any);
  };

  handleGateChange = (event: SelectChangeEvent<Gate>) => {
    this.setState({ newGate: event.target.value as Gate });
  };

  handleAddNewFlight = async () => {
    const {
      newFlightNumber,
      newDestinationCity,
      newDestinationAirportCode,
      newDestinationCountry,
      newOriginalDepartureTime,
      newGate
    } = this.state;

    if (!newFlightNumber || !newDestinationCity || !newDestinationAirportCode || !newDestinationCountry || !newOriginalDepartureTime) {
      this.setState({ addFlightError: 'All fields are required.' });
      return;
    }

    let departureTimeObject;
    try {
      departureTimeObject = new Date(newOriginalDepartureTime);
      if (isNaN(departureTimeObject.getTime())) {
        throw new Error('Invalid date format for departure time.');
      }
      const minDateTime = new Date(this.state.minDateTimeValue + ':00Z');
      if (departureTimeObject.getTime() < minDateTime.getTime()) {
        this.setState({ addFlightError: 'Departure time cannot be in the past.', isAddingFlight: false });
        return;
      }
    } catch (e) {
      this.setState({ addFlightError: 'Invalid Departure Time. Please use YYYY-MM-DDTHH:MM format.', isAddingFlight: false });
      return;
    }

    const newFlightData: NewFlight = {
      flightNumber: newFlightNumber,
      destination: {
        city: newDestinationCity,
        airportCode: newDestinationAirportCode,
        country: newDestinationCountry
      },
      originalDepartureTime: departureTimeObject.toISOString(),
      gate: newGate,
    };

    this.setState({ isAddingFlight: true, addFlightError: null });

    try {
      await addFlight(newFlightData);
      this.setState({
        showAddFlightForm: false,
        newFlightNumber: '',
        newDestinationCity: '',
        newDestinationAirportCode: '',
        newDestinationCountry: '',
        newOriginalDepartureTime: '',
        newGate: Gate.A1,
        isAddingFlight: false,
      });
      this.props.onFlightAdded();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred adding the flight.';
      this.setState({ addFlightError: errorMessage, isAddingFlight: false });
    }
  };

  handleFabHover = (isHovered: boolean) => {
    this.setState({ isFabHovered: isHovered });
  };

  render() {
    const {
      showAddFlightForm,
      isFabHovered,
      newFlightNumber,
      newDestinationCity,
      newDestinationAirportCode,
      newDestinationCountry,
      newOriginalDepartureTime,
      newGate,
      addFlightError,
      isAddingFlight,
      minDateTimeValue,
    } = this.state;

    return (
      showAddFlightForm ? (
        <Paper id="addFlightFormPaper" elevation={4}>
          <Typography variant="h6" className="addFlightFormTitle">Add New Flight</Typography>
          <TextField label="Flight Number" name="newFlightNumber" value={newFlightNumber} onChange={this.handleNewFlightInputChange} size="small" disabled={isAddingFlight} />
          <TextField label="Destination City" name="newDestinationCity" value={newDestinationCity} onChange={this.handleNewFlightInputChange} size="small" disabled={isAddingFlight} />
          <TextField label="Destination Country" name="newDestinationCountry" value={newDestinationCountry} onChange={this.handleNewFlightInputChange} size="small" disabled={isAddingFlight} />
          <TextField label="Airport Code" name="newDestinationAirportCode" value={newDestinationAirportCode} onChange={this.handleNewFlightInputChange} size="small" disabled={isAddingFlight} />
          <TextField
            label="Departure Time"
            name="newOriginalDepartureTime"
            value={newOriginalDepartureTime}
            onChange={this.handleNewFlightInputChange}
            size="small"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            disabled={isAddingFlight}
            inputProps={{
              min: minDateTimeValue,
            }}
          />
          <FormControl fullWidth size="small" disabled={isAddingFlight}>
            <InputLabel id="gate-select-label">Gate</InputLabel>
            <Select
              labelId="gate-select-label"
              id="gate-select"
              name="newGate"
              value={newGate}
              label="Gate"
              onChange={this.handleGateChange}
            >
              {Object.values(Gate).map((gateValue) => (
                <MenuItem key={gateValue} value={gateValue}>
                  {gateValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {addFlightError && <Typography color="error" variant="caption" className="addFlightFormError">{addFlightError}</Typography>}
          <Box className="addFlightFormActions">
            <Button onClick={this.handleAddFlightToggle} size="small" disabled={isAddingFlight}>Cancel</Button>
            <Button onClick={this.handleAddNewFlight} variant="contained" size="small" disabled={isAddingFlight}>
              {isAddingFlight ? 'Adding...' : 'Add Flight'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Tooltip title="Add Flight" placement="left">
          <div
            aria-label="add flight"
            className="addFlightFab"
          >

            <Fab
              color="primary"
              onClick={this.handleAddFlightToggle}
              onMouseEnter={() => this.handleFabHover(true)}
              onMouseLeave={() => this.handleFabHover(false)}
              variant={isFabHovered ? 'extended' : 'circular'}
            >
              <AddIcon className={`addFlightFabIcon ${isFabHovered ? 'extended' : ''}`} />
              {isFabHovered && (
                <Box
                  component="span"
                  className={`addFlightFabText ${isFabHovered ? 'visible' : ''}`}
                >
                  Add Flight
                </Box>
              )}
            </Fab>
          </div>
        </Tooltip>
      ));
  }
}

export default AddFlight; 