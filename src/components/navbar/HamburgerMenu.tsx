import React from 'react'

interface Props {
  activeClass: string
  onToggle: () => void
}

export const HamburgerMenu: React.FC<Props> = ({ activeClass, onToggle }) => (
  <div
    className={`navbar-burger burger ${activeClass}`}
    data-target="navMenu"
    onKeyDown={(event) => event.target === document.activeElement && onToggle()}
    role="button"
    tabIndex={0}
    onClick={() => onToggle()}
  >
    <span />
    <span />
    <span />
  </div>
)
