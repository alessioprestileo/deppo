const path = require('path')
const fs = require('fs')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const pageTemplateExtensions = ['ts', 'tsx']
    const posts = result.data.allMarkdownRemark.edges
    posts.forEach((edge) => {
      const { id } = edge.node
      let component = ''
      pageTemplateExtensions.some((ext) => {
        const maybePath = path.resolve(
          `src/frontend/templates/${String(edge.node.frontmatter.templateKey)}.${ext}`,
        )
        if (fs.existsSync(maybePath)) {
          component = maybePath

          return true
        }

        return false
      })

      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component,
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })

    return Promise.resolve(true)
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: 'slug',
      node,
      value,
    })
  }
}
