import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@reach/router' // this package comes with Gatsby

import { Layout } from '../components/Layout'
import PrivateRoute from '../services/authentication/deppo-backend/PrivateRoute'
// import LogoutCallback from '../services/authentication/deppo-backend/LogoutCallback'
import LoginRedirect from '../services/authentication/deppo-backend/LoginRedirect'
import Home from '../templates/protected/home'
import UserDetails from '../templates/protected/user-details'
import NotFoundPage from './404'

const Protected: React.FC = () => (
  <Layout>
    <Router basepath="/protected">
      <LoginRedirect path="/login-redirect" />
      {/* <LogoutCallback path="/logout" /> */}
      <PrivateRoute path="/user-details" component={UserDetails} />
      <Home path="/" />
      <NotFoundPage default />
    </Router>
  </Layout>
)

export default Protected
