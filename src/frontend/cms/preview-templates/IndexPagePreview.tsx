import React from 'react'
import { PreviewTemplateComponentProps } from 'netlify-cms-core'

import {
  IndexPageTemplate,
  IndexPageTemplateProps,
} from '../../templates/index-page'

const IndexPagePreview: React.FC<PreviewTemplateComponentProps> = ({
  entry,
}) => {
  const frontmatter: IndexPageTemplateProps['frontmatter'] = entry
    .getIn(['data'])
    .toJS()
  if (frontmatter) {
    return <IndexPageTemplate frontmatter={frontmatter} />
  }

  return <div>Loading...</div>
}

export default IndexPagePreview
