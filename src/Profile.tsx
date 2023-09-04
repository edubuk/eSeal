import './Profile.css';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ShivaniImg from './images/shivani.jpeg';
import ApoorvaImg from './images/apoorva.jpeg'

export function Profile() {
  return (
    <>
      <div className="card">
        <img className="image" style={{width: "100%", height: "100%"}} src={ShivaniImg} />
        <p>Shivani Mehrortra</p>
        <p style={{fontSize: "1.2rem"}}>
          CEO & Co-Founder
        </p>
        <p style={{fontSize: "1rem", textAlign: "center", textJustify: "inter-word"}}>
          University Topper, UCG NET Qualified Professor in Economics and Management, Top 30 Young Indian Awardee with more than 10 years of experience in education industry. Appointed as National Vice President of Emerging Technologies Wing in WICCI (Women’s Indian Chamber of Commerce and Industry). Microsoft Certified Innovative Educator for Emerging Technologies Skilling.
        </p>
        <a href="https://www.linkedin.com/in/shivani-mehrotra-edubuk/" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
      </div>
      <div className="card">
        <img className="image" style={{width: "100%", height: "100%"}} src={ApoorvaImg} />
        <p>Apoorva Bajaj</p>
        <p style={{fontSize: "1.2rem"}}>
          CTO & Co-Founder
        </p>
        <p style={{fontSize: "1rem", textAlign: "center", textJustify: "inter-word"}}>
          Engineer from IIT and MBA from IIM (2 best institutes in India for Engineering and MBA), Gold Medallist, a CFA Charterholder (all 3 levels cleared in first attempt) with 10+ years of work experience in the Financial Markets (Hedge Funds and Investment Management) working with MNCs like Goldman Sachs, JP Morgan, DE Shaw and GlobalData's quant hedge fund clients. Completed training from ISB (Indian School of Business) Hyderabad, IBM and Google on various courses in Emerging Technologies.  Sought-after global consultant and trainer in emerging technologies skills.
        </p>
        <a href="https://www.linkedin.com/in/apoorva-bajaj-edubuk/" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
      </div>
    </>
  )
}

