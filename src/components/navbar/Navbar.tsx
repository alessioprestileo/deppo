import React, { useState } from 'react'
import { Link } from 'gatsby'

import { HamburgerMenu } from './HamburgerMenu'
import styles from './navbar.module.sass'

const Navbar: React.FC = () => {
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
            <Link className="navbar-item" to="/about">
              About
            </Link>
            <Link className="navbar-item" to="/products">
              Products
            </Link>
            <Link className="navbar-item" to="/blog">
              Blog
            </Link>
            <Link className="navbar-item" to="/contact">
              Contact
            </Link>
            <Link className="navbar-item" to="/contact/examples">
              Form Examples
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
