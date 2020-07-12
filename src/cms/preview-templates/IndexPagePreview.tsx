import React from 'react'
import { PreviewTemplateComponentProps } from 'netlify-cms-core'

import {
  IndexPageTemplate,
  IndexPageTemplateProps,
} from '../../templates/index-page'

const IndexPagePreview: React.FC<PreviewTemplateComponentProps> = ({
  entry,
}) => {
  const data: IndexPageTemplateProps = entry.getIn(['data']).toJS()
  if (data) {
    return <IndexPageTemplate message={data.message} />
  }

  return <div>Loading...</div>
}

export default IndexPagePreview
