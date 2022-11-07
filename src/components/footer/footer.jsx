import React from 'react'

const Footer = () => {
  const footerStyle = {
    color: '#42476d',
    position: 'absolute',
    left: '-1rem',
    bottom: '-2.5rem',
    opacity: '.6',
  }

  return (
    <p className='footer' style={footerStyle}>
      Note app, Immanuel Toby
    </p>
  )
}

export default Footer
