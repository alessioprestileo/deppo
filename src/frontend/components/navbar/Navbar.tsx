import React, { useState } from 'react'
import { Link } from 'gatsby'

import { HamburgerMenu } from './HamburgerMenu'
import { AuthConsumer, AuthService } from '../../services/authentication'
import styles from './navbar.module.sass'

const renderProtectedItems = () => (
  <>
    <Link className="navbar-item" to="/protected/dashboard">
      Dashboard
    </Link>
    <Link className="navbar-item" to="/protected/user-details">
      Profile
    </Link>
    <Link className="navbar-item" to="/protected/logout">
      Logout
    </Link>
  </>
)

interface ContentProps {
  authService: AuthService
}

const Content: React.FC<ContentProps> = ({ authService }) => {
  const { isAuthenticated } = authService
  const [active, setActive] = useState(false)
  const toggleHamburger = () => setActive(!active)
  const activeClass = active ? 'is-active' : ''

  return (
    <nav className="navbar" role="navigation" aria-label="main-navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link
            to="/"
            className={`navbar-item ${styles.deppoStyleLogo}`}
            title="Logo"
          >
            Deppo.no
          </Link>
          <HamburgerMenu activeClass={activeClass} onToggle={toggleHamburger} />
        </div>
        <div id="navMenu" className={`navbar-menu ${activeClass}`}>
          <div className="navbar-start has-text-centered">
            <Link className="navbar-item" to="/">
              Home
            </Link>
            <Link className="navbar-item" to="/about">
              About
            </Link>
            <Link className="navbar-item" to="/contact">
              Contact
            </Link>
          </div>
          <div className="navbar-end has-text-centered">
            {!isAuthenticated() && (
              <Link className="navbar-item" to="/protected">
                Login
              </Link>
            )}
            {isAuthenticated() && renderProtectedItems()}
          </div>
        </div>
      </div>
    </nav>
  )
}

export const Navbar: React.FC = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)
