import React from 'react'
import remark from 'remark'
import remarkLintRecommended from 'remark-preset-lint-recommended'
import remarkHtml from 'remark-html'

interface Props {
  markdown: string
}

export const MarkdownWidget: React.FC<Props> = ({ markdown }) => {
  const innerHtml = remark()
    .use(remarkLintRecommended)
    .use(remarkHtml)
    .processSync(markdown)
    .toString()

  return (
    <div className="content" dangerouslySetInnerHTML={{ __html: innerHtml }} />
  )
}
