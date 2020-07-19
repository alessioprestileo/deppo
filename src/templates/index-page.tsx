import React from 'react'
import { graphql } from 'gatsby'

import { MarkdownWidget } from '../components/markdown-widget/MarkdownWidget'
import { Layout } from '../components/Layout'
import { VideoPlayer } from '../components/VideoPlayer'
import { IndexPageTemplateQuery } from '../../graphql-types'

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        welcomeSection {
          blurbs {
            image {
              publicURL
            }
          }
          message
          title
          videoUrl
        }
        customerStories {
          title
          feedbacks {
            author
            content
          }
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
  const welcomeTitle = frontmatter?.welcomeSection?.title
  const message = frontmatter?.welcomeSection?.message
  const videoUrl = frontmatter?.welcomeSection?.videoUrl
  const storiesTitle = frontmatter?.customerStories?.title

  return (
    <Layout>
      <section>
        <div className="columns is-vcentered">
          <div className="column is-three-fifths">
            {welcomeTitle && <div className="title">{welcomeTitle}</div>}
            {message && <MarkdownWidget markdown={message} />}
            <div className="columns">
              <div className="column is-2 is-offset-9">
                <a className="button" href="/onboarding">
                  Start nå
                </a>
              </div>
            </div>
          </div>
          <div className="column">
            {videoUrl && <VideoPlayer url={videoUrl} width="auto" />}
          </div>
        </div>
      </section>
      <section>{storiesTitle}</section>
      <section>third section</section>
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
