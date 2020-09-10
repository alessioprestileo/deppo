import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@reach/router' // this package comes with Gatsby

import { Layout } from '../components/Layout'
import PrivateRoute from '../services/authentication/PrivateRoute'
import LoginRedirect from '../services/authentication/LoginRedirect'
import Home from '../templates/protected/home'
import UserDetails from '../templates/protected/user-details'
import CancelDocument from '../templates/protected/cancel-document'
import CreateDocument from '../templates/protected/create-document'
import DocumentsList from '../templates/protected/documents-list'
import NotFoundPage from './404'

const Protected: React.FC = () => (
  <Layout>
    <Router basepath="/protected">
      <LoginRedirect path="/login-redirect" />
      <PrivateRoute path="/cancel-document" component={CancelDocument} />
      <PrivateRoute path="/create-document" component={CreateDocument} />
      <PrivateRoute path="/documents-list" component={DocumentsList} />
      <PrivateRoute path="/user-details" component={UserDetails} />
      <Home path="/" />
      <NotFoundPage default />
    </Router>
  </Layout>
)

export default Protected
