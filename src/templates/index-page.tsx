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
      }
    }
  }
`

interface TemplateProps {
  message: string
}

export const IndexPageTemplate: React.FC<TemplateProps> = ({ message }) => (
  <div>{message}</div>
)

interface WrapperProps {
  data: IndexPageTemplateQuery
}

const IndexPage: React.FC<WrapperProps> = ({ data }) => {
  const { message } = data.markdownRemark.frontmatter.welcomeSection

  return (
    <Layout>
      <IndexPageTemplate message={message} />
    </Layout>
  )
}

export default IndexPage
