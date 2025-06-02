import React from 'react';
import FlightTable from './components/FlightTable';
import './App.css'; // We can add some basic styling here later

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My beautiful Flight Board</h1>
      </header>
      <main>
        <FlightTable />
      </main>
    </div>
  );
}

export default App;
