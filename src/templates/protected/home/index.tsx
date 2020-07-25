import React, { useState } from 'react'
import { navigate } from 'gatsby'

import {
  LOGIN_OPTIONS,
  AuthService,
  AuthConsumer,
} from '../../../services/authentication'

interface Props {
  path?: '/'
}

const Home: React.FC<Props> = () => {
  const [loginOption, setLoginOption] = useState(-1)
  const handleSelect = (
    event: React.SyntheticEvent<HTMLSelectElement, Event>,
  ) => setLoginOption(parseInt((event.target as HTMLInputElement).value, 10))
  const handleLoginClick = () =>
    new AuthService(LOGIN_OPTIONS[loginOption].AcrValues).signinRedirect()
  const goToUserDetails = () => navigate('/user-details')
  const oidcStorageItem = sessionStorage.getItem(
    `oidc.user:${process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY}:${process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID}`,
  )
  const userName = oidcStorageItem && JSON.parse(oidcStorageItem).profile.name

  return (
    <AuthConsumer>
      {({ isAuthenticated, logout }) =>
        isAuthenticated() ? (
          <section>
            <h1>Hello {userName}!</h1>
            <button type="button" onClick={goToUserDetails}>
              User Details
            </button>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </section>
        ) : (
          <div>
            <h1>Welcome to Criipto Demo App for React</h1>
            <div>VARIABLE: {process.env.GATSBY_USELESS_VAR}</div>
            <div>
              <select onChange={handleSelect}>
                <option value="-1">Select an option</option>
                {LOGIN_OPTIONS.map((item) => (
                  <option key={item.Id} value={item.Id}>
                    {item.FullName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleLoginClick}
                disabled={loginOption === -1}
              >
                Log in
              </button>
            </div>
          </div>
        )
      }
    </AuthConsumer>
  )
}

export default Home
