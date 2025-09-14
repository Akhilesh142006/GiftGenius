import React from 'react';

function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'white',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '16px 0'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#4A90E2',
          textAlign: 'center',
          margin: 0
        }}>
          🎁 GiftGenius
        </h1>
      </div>
    </header>
  );
}

export default Header;