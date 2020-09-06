import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@reach/router' // this package comes with Gatsby

import { Layout } from '../components/Layout'
import PrivateRoute from '../services/authentication/PrivateRoute'
import LoginRedirect from '../services/authentication/LoginRedirect'
import Home from '../templates/protected/home'
import UserDetails from '../templates/protected/user-details'
import CreateDocument from '../templates/protected/create-document'
import NotFoundPage from './404'

const Protected: React.FC = () => (
  <Layout>
    <Router basepath="/protected">
      <LoginRedirect path="/login-redirect" />
      <PrivateRoute path="/user-details" component={UserDetails} />
      <PrivateRoute path="/create-document" component={CreateDocument} />
      <Home path="/" />
      <NotFoundPage default />
    </Router>
  </Layout>
)

export default Protected
