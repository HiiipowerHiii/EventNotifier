import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  // State to handle the toggle of the hamburger menu
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="event-notifier-header">
      <nav>
        <div className="logo">
          EventNotifier
        </div>
        {/* Hamburger Icon */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className={isOpen ? 'bar open' : 'bar'}></div>
          <div className={isOpen ? 'bar open' : 'bar'}></div>
          <div className={isOpen ? 'bar open' : 'bar'}></div>
        </div>
        {/* Conditional rendering based on the state */}
        <ul className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/events" onClick={toggleMenu}>Events</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
```
```css
/* Add to your Header.css */

/* Basic Hamburger styles */
.hamburger {
  display: none;
  cursor: pointer;
}

.bar {
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 5px 0;
  transition: 0.4s;
}

/* Animation */
.nav-active {
  display: block;
}

.open.bar:nth-child(2) {
  opacity: 0;
}

.open.bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.open.bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    flex-direction: column;
    align-items: center;
  }

  .nav-links.nav-active {
    display: flex;
  }

  .hamburger {
    display: block;
  }
}