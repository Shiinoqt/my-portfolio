import { useState } from 'react'
import contactsIcon from '../../assets/contacts.png'
import './Navbar.css'

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleNavbarClick = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="navbar-shell">
        <div 
          className="navbar-elem" 
          onClick={handleNavbarClick}
          style={{ cursor: 'pointer' }}
        >
            <div className="navbar-icon">
                <img src={contactsIcon} alt="Contacts"></img>
            </div>
        </div>
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>✕</button>
              <h2>About Me</h2>
              <p>Hello, I'm a software developer passionate about creating innovative solutions.</p>
            </div>
          </div>
        )}
    </div>
  )
}

export default Navbar