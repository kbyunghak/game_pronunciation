import React from 'react';

function Footer() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '15px 0',
      backgroundColor: '#e3f2fd',
      color: '#555',
      fontSize: '14px',
      borderTop: '1px solid #ccc',
      marginTop: '40px'
    }}>
      © {new Date().getFullYear()} | Design by <strong>Andrew</strong>
    </div>
  );
}

export default Footer;
