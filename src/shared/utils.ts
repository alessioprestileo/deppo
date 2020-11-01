import { AxiosPromise } from 'axios'

export const isClientSide = (): boolean => typeof window !== 'undefined'

export const hasLocalStorage = (): boolean =>
  typeof localStorage !== 'undefined'

function waitNMilliseconds<T>(time: number, fn: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), time)
  })
}

export const requestWithTimeout = <T extends AxiosPromise<any>>(
  req: T,
): Promise<'expired' | (T extends PromiseLike<infer U> ? U : T)> =>
  Promise.race([req, waitNMilliseconds(5000, () => 'expired' as const)])
