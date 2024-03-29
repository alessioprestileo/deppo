import 'jest-extended'

import App from '../../src/backend/app'

process.env.NODE_ENV = 'test'

jest.setTimeout(10000)

const app = new App()

beforeAll(async () => {
  await app.start()
})

afterAll(async () => {
  await app.stop()
})
