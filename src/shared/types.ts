// eslint-disable-next-line import/no-extraneous-dependencies
import { RouteComponentProps } from '@reach/router' // this package comes with Gatsby

export { RouteComponentProps }

export type Dictionary<T = any> = Record<string, T | undefined>

export type BaseResponse = { success: boolean }
