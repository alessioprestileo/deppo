import React from 'react'

import logo from '../assets/img/logo.svg'
import facebook from '../assets/img/social/facebook.svg'
import instagram from '../assets/img/social/instagram.svg'
import twitter from '../assets/img/social/twitter.svg'
import vimeo from '../assets/img/social/vimeo.svg'

export const Footer = () => (
  <footer className="footer has-background-black has-text-white-ter">
    <div className="content has-text-centered">
      <img src={logo} alt="Kaldi" style={{ width: '14em', height: '10em' }} />
    </div>
    <div className="content has-text-centered has-background-black has-text-white-ter">
      <div className="container has-background-black has-text-white-ter">
        <div style={{ maxWidth: '100vw' }} className="columns">
          <div className="column is-4 social">
            <a title="facebook" href="https://facebook.com">
              <img
                src={facebook}
                alt="Facebook"
                style={{ width: '1em', height: '1em' }}
              />
            </a>
            <a title="twitter" href="https://twitter.com">
              <img
                className="fas fa-lg"
                src={twitter}
                alt="Twitter"
                style={{ width: '1em', height: '1em' }}
              />
            </a>
            <a title="instagram" href="https://instagram.com">
              <img
                src={instagram}
                alt="Instagram"
                style={{ width: '1em', height: '1em' }}
              />
            </a>
            <a title="vimeo" href="https://vimeo.com">
              <img
                src={vimeo}
                alt="Vimeo"
                style={{ width: '1em', height: '1em' }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
)
