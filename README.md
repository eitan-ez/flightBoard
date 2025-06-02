# Flight Board UI

This project is a React-based user interface for displaying and managing flight information. It allows users to view a list of flights, add new flights, delete existing flights, and filter the flight data by destination city and status.

## Prerequisites

To run this project, you will need:

*   **Node.js**: Version 20.x or higher. You can download it from [nodejs.org](https://nodejs.org/).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Installation & Running the Project

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/eitan-ez/flightBoard.git
    cd flightBoard
    ```

2.  **Install dependencies:**
    Navigate to the project directory (if you're not already there) and run:
    ```bash
    npm install
    ```
    This will install all the necessary packages defined in `package.json`.

3.  **Run the development server:**
    Once the dependencies are installed, you can start the React development server by running:
    ```bash
    npm start
    ```
    This command runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload automatically if you make edits to the source files.

## Basic User Manual

The Flight Board application provides a simple interface to manage flight information.

### Viewing Flights

*   Upon loading, the main table displays a list of current flights.
*   Each row shows:
    *   **Flight Number**: The unique identifier for the flight.
    *   **Destination**: The destination city and airport code.
    *   **Departure Time**: The scheduled departure time (displayed in DD/MM/YYYY format).
    *   **Gate**: The assigned gate for the flight.
    *   **Status**: The current status of the flight (e.g., Scheduled, Boarding, Departed, Landed, Delayed, Cancelled). The status is calculated based on the departure time and information from the API.

### Filtering Flights

*   Above the flight table, you will find filter options:
    *   **Filter by Destination City**: Enter a city name to see only flights going to that destination.
    *   **Filter by Status**: Select a status from the dropdown (e.g., SCHEDULED, DELAYED) to see flights matching that status.
*   After entering your filter criteria, click the **"Apply Filters"** button.
*   To remove all active filters and view all flights, click the **"Clear Filters"** button.

### Adding a New Flight

1.  Click the **"+" (Add Flight)** button located at the bottom right of the screen.
2.  An inline form will appear. Fill in the following details for the new flight:
    *   Flight Number
    *   Destination City
    *   Destination Country
    *   Airport Code
    *   Departure Time (Cannot be in the past)
    *   Gate (Select from the dropdown)
3.  Click the **"Add Flight"** button on the form to submit the new flight.
4.  Click **"Cancel"** to close the form without adding a flight.
5.  The input field for "Departure Time" will not allow selecting a date and time in the past from when the form was opened.

### Deleting a Flight

*   In each flight row, there is a **Delete** icon (trash can).

---
