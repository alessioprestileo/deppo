export const isClientSide = (): boolean => typeof window !== 'undefined'

export const hasSessionStorage = (): boolean =>
  typeof sessionStorage !== 'undefined'
