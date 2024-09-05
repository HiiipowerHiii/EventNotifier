import React, { useState, memo } from 'react'; 
import { Link } from 'react-router-dom';
import './Header.css';

const Header = memo(() => { 
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="event-notifier-header">
      <nav>
        <div className="logo">
          EventNotifier
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={isOpen ? 'bar open' : 'bar'}></div>
          <div className={isOpen ? 'bar open' : 'bar'}></div>
          <div className={isOpen ? 'bar open' : 'bar'}></div>
        </div>
        <ul className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/events" onClick={toggleMenu}>Events</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
});

export default Header;