import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@reach/router' // this package comes with Gatsby

import { Layout } from '../frontend/components'
import PrivateRoute from '../frontend/services/authentication/PrivateRoute'
import LoginRedirect from '../frontend/services/authentication/LoginRedirect'
import Home from '../frontend/templates/protected/home'
import UserDetails from '../frontend/templates/protected/user-details'
import CancelDocument from '../frontend/templates/protected/cancel-document'
import CreateDocument from '../frontend/templates/protected/create-document'
import CreateDeposit from '../frontend/templates/protected/create-deposit'
import Dashboard from '../frontend/templates/protected/dashboard'
import Logout from '../frontend/templates/protected/logout'
import NotFoundPage from './404'

const Protected: React.FC = () => (
  <Layout>
    <Router basepath="/protected">
      <LoginRedirect path="/login-redirect" />
      <PrivateRoute path="/cancel-document" component={CancelDocument} />
      <PrivateRoute path="/create-document" component={CreateDocument} />
      <PrivateRoute path="/create-deposit" component={CreateDeposit} />
      <PrivateRoute path="/user-details" component={UserDetails} />
      <PrivateRoute path="/logout" component={Logout} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Home path="/" />
      <NotFoundPage default />
    </Router>
  </Layout>
)

export default Protected
