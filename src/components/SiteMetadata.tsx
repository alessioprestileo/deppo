import { graphql, useStaticQuery } from 'gatsby'

import { SiteMetadataQuery } from '../../graphql-types'

const useSiteMetadata = () => {
  const data: SiteMetadataQuery = useStaticQuery(
    graphql`
      query SiteMetadata {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `,
  )
  const { site } = data

  return site.siteMetadata
}

export default useSiteMetadata
