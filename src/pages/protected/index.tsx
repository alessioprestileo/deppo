import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@reach/router' // this package comes with Gatsby

import { Layout } from '../../components/Layout'
import { PrivateRoute } from '../../services/authentication/PrivateRoute'
import { Default } from './default/default'
import { UserDetails } from './user-details/UserDetails'
import { RedirectCallback } from './RedirectCallback'
import { LogoutCallback } from './LogoutCallback'

const Protected: React.FC = () => (
  <Layout>
    <Router basepath="/protected">
      <RedirectCallback path="/RedirectCallback" />
      <LogoutCallback path="/logout" />
      <PrivateRoute path="/user-details" component={UserDetails} />
      <Default path="/" />
    </Router>
  </Layout>
)

export default Protected
