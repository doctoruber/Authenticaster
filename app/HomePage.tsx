import React from 'react';
import Navbar from './NavBar'; 
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <div className="animation-container"></div>
      </div>
      <div className="content">
        <p>Authenticaster is a service that tells you your reliability score in the farcaster ecosystem.</p>
      </div>
    </div>
  );
};

export default HomePage;
