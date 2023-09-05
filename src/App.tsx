import './App.css';
import { Footer } from './Footer';
import { Header } from './Header';
import { Hero } from './Hero';
import { Profile } from './Profile';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div className="App">
      <Helmet>
        <meta charSet='utf-8' />
        <title>Edubuk - eSeal</title>
        <meta name='description' content='Edubuk eSeal dApp on Concordium blockchain' />
      </Helmet>

      <Header />

      <Hero />

      <Profile />

      <Footer />
    </div>
  );
}

export default App;
