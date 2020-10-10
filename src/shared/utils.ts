export const isClientSide = (): boolean => typeof window !== 'undefined'

export const hasLocalStorage = (): boolean =>
  typeof localStorage !== 'undefined'

function waitNMilliseconds<T>(time: number, fn: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), time)
  })
}

export const requestWithTimeout = (
  req: Promise<Response>,
): Promise<Response | 'expired'> =>
  Promise.race([req, waitNMilliseconds(5000, () => 'expired' as const)])
