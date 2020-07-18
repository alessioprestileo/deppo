import React from 'react'
import { graphql } from 'gatsby'

import { MarkdownWidget } from '../components/markdown-widget/MarkdownWidget'
import { Layout } from '../components/Layout'
import { IndexPageTemplateQuery } from '../../graphql-types'

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        welcomeSection {
          message
        }
        customerStories {
          title
        }
      }
    }
  }
`

export interface IndexPageTemplateProps {
  frontmatter: Exclude<
    IndexPageTemplateQuery['markdownRemark'],
    null | undefined
  >['frontmatter']
}

export const IndexPageTemplate: React.FC<IndexPageTemplateProps> = ({
  frontmatter,
}) => {
  const message = frontmatter?.welcomeSection?.message
  const title = frontmatter?.customerStories?.title

  return (
    <Layout>
      {message && <MarkdownWidget markdown={message} />}
      <div>{title}</div>
    </Layout>
  )
}

interface IndexPageProps {
  data: IndexPageTemplateQuery
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const frontmatter = data.markdownRemark?.frontmatter
  return <IndexPageTemplate frontmatter={frontmatter} />
}

export default IndexPage
