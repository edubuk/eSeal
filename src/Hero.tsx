import './App.css';
import React from 'react';
import { Sealer } from './Sealer';

export function Hero() {
  const hero_span_style = {
    border: "3px solid #ff80dfff",
    padding: "2em",
    borderRadius: "8px",
  };

  return (
    <>
    <div className="container hero" style={{paddingTop: "5vh"}}>
      <span style={hero_span_style}>
        <h1>Edubuk<br />eSeal dApp</h1>
        <p style={{fontSize: "24px", paddingTop: "3vh", textAlign: "center"}}><span className="highlight">Powered by Concordium</span></p>
        <div className="button-group" style={{justifyContent: "center", paddingTop: "3vh"}}>
          <a href="#sealer"><button type="button">eSeal Your Certificates</button></a>
        </div>
      </span>
    </div>
      <div>
        <Sealer />
      </div>
    </>
  )
}
