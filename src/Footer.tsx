import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faLinkedin, faTelegram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'

export function Footer() {
  return (
    <footer>
      <div className="container container-purple">
        <div className="sociallinks" style={{textAlign: "center", padding: "4vh 0vh", columnGap: "10px"}}>
          <a target="_blank" href="https://www.linkedin.com/in/edubuk-ai-driven-decentralized-skilling-ecosystem-on-blockchain/"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a target="_blank" href="https://t.me/+boPh8H_HpNljZDZl"><FontAwesomeIcon icon={faTelegram} /></a>
          <a target="_blank" href="https://www.instagram.com/edubuk_/"><FontAwesomeIcon icon={faInstagram} /></a>
          <a target="_blank" href="https://twitter.com/edubuktrust"><FontAwesomeIcon icon={faTwitter} /></a>
          <a target="_blank" href="https://www.facebook.com/edubuk.trst/"><FontAwesomeIcon icon={faFacebook} /></a>
          <a target="_blank" href="https://www.youtube.com/channel/UC4g4MH4F_JTbd1tqNS5pq1g/videos"><FontAwesomeIcon icon={faYoutube} /></a>
        </div>
        <a href="https://www.edubuk.io/" target="_blank" className="anchor">
          <span style={{color: "#ffffff", fontWeight: "600"}}>Made with ❤️  by Edubuk.io</span>
        </a>
        <div style={{paddingTop: "2vh", justifyContent: "center", textAlign: "center"}}>
          <span style={{paddingTop: "1em", fontWeight: "600", color: "#ffffff"}}><span style={{fontSize: "1.2em"}}>©</span> Copyright 2023 - Edubuk</span>
        </div>
      </div>
    </footer>
  )
};
    
