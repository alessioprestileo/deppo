import React from 'react'

export const PageContent: React.FC = ({ children }) => (
  <section className="hero container is-fullheight-with-navbar">
    {children}
  </section>
)
