import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
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
  data: IndexPageTemplateQuery
}

export const IndexPageTemplate: React.FC<IndexPageTemplateProps> = ({
  data,
}) => {
  const title = data.markdownRemark?.frontmatter?.customerStories?.title

  return (
    <Layout>
      <div>{title}</div>
    </Layout>
  )
}

const IndexPage: React.FC<IndexPageTemplateProps> = ({ data }) => (
  <IndexPageTemplate data={data} />
)

export default IndexPage
