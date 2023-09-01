import React from 'react';
// import logo from './logo.svg';
import './App.css';
import edubuk from './edubuk.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={edubuk} className="App-logo" alt="logo" />
        <a
          className="App-button"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <div className="body container">
        <div className="box">
          Edubuk eSeal dApp
        </div>
      </div>

      <footer className="footer container-purple">
        <h2>This is Footer</h2>
      </footer>
    </div>
  );
}

export default App;
