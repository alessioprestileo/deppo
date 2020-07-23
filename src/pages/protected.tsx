import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@reach/router' // this package comes with Gatsby

import { Layout } from '../components/Layout'
import PrivateRoute from '../services/authentication/PrivateRoute'
import LogoutCallback from '../services/authentication/LogoutCallback'
import RedirectCallback from '../services/authentication/RedirectCallback'

import Home from '../templates/protected/home'
import UserDetails from '../templates/protected/user-details'
import NotFoundPage from './404'

const Protected: React.FC = () => (
  <Layout>
    <Router basepath="/protected">
      <RedirectCallback path="/RedirectCallback" />
      <LogoutCallback path="/logout" />
      <PrivateRoute path="/user-details" component={UserDetails} />
      <Home path="/" />
      <NotFoundPage default />
    </Router>
  </Layout>
)

export default Protected
