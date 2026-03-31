import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo  from './assets/XploreMath2.jpg';
import { Menu, X, User, Home, MessageSquare, Info, Phone } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Forum', path: '/forum' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`nav-v2 ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleNav('/')}>
          <img src={Logo} alt="XploreMath Logo" className='logo' />
        </div>

        <ul className="nav-desktop">
          {navItems.map((item) => (
            <li key={item.name}>
              <button 
                onClick={() => handleNav(item.path)}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <ul className="nav-mobile">
          {navItems.map((item) => ( 
            <li key={item.name}>
              <button 
                onClick={() => handleNav(item.path)}
                className={
                  location.pathname === item.path ? 'active' : ''
                }
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;