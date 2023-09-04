import edubuk from './edubuk.svg';
import './App.css';

export function Header() {
  // const logo_style = {
  //   display: "inline-block",
  // }©

  return (
      <header className="header">
        <div className="wrapper container">
          <img src={edubuk} className="logo" alt="logo" style={{display: "inline-block", width: "130px", height: "130px"}} />
          <a
            href="https://edubuk.io"
            target="_blank"
            rel="noopener noreferrer"
          className='button'
          >
              Explore CETA Certification
          </a>
        </div>
      </header>
  )
}
