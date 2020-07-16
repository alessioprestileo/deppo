declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.sass' {
  const content: { [className: string]: string }
  export default content
}

declare module 'remark-preset-lint-recommended'

declare module 'remark-html'
