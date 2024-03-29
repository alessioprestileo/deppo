import React from 'react'

import { RouteComponentProps } from '../frontend/shared/types'
import { Layout } from '../frontend/components'

const NotFoundPage: React.FC<RouteComponentProps> = () => (
  <Layout>
    <div>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
)

export default NotFoundPage
