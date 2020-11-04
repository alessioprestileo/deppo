import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@reach/router' // this package comes with Gatsby

import { Layout } from '../components'
import PrivateRoute from '../services/authentication/PrivateRoute'
import LoginRedirect from '../services/authentication/LoginRedirect'
import Home from '../templates/protected/home'
import UserDetails from '../templates/protected/user-details'
import CancelDocument from '../templates/protected/cancel-document'
import CreateDocument from '../templates/protected/create-document'
import Dashboard from '../templates/protected/dashboard'
import Logout from '../templates/protected/logout'
import NotFoundPage from './404'

const Protected: React.FC = () => (
  <Layout>
    <Router basepath="/protected">
      <LoginRedirect path="/login-redirect" />
      <PrivateRoute path="/cancel-document" component={CancelDocument} />
      <PrivateRoute path="/create-document" component={CreateDocument} />
      <PrivateRoute path="/user-details" component={UserDetails} />
      <PrivateRoute path="/logout" component={Logout} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Home path="/" />
      <NotFoundPage default />
    </Router>
  </Layout>
)

export default Protected
