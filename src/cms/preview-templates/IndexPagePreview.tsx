import React from 'react'
import { PreviewTemplateComponentProps } from 'netlify-cms-core'

import { IndexPageTemplate } from '../../templates/index-page'
import { IndexPageTemplateQuery } from '../../../graphql-types'

const IndexPagePreview: React.FC<PreviewTemplateComponentProps> = ({
  entry,
}) => {
  const data: IndexPageTemplateQuery = entry.getIn(['data']).toJS()
  if (data) {
    return <IndexPageTemplate data={data} />
  }

  return <div>Loading...</div>
}

export default IndexPagePreview
