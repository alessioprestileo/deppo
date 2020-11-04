import { request } from './request'

const deppoFrontendApiKey = process.env.DEPPO_FRONTEND_KEY

describe('indexController', () => {
  it('GET /v1/', async () => {
    const { data, status } = await request.get('/v1', {
      headers: { 'api-key': deppoFrontendApiKey },
    })

    expect(status).toBe(200)
    expect(data).toHaveProperty('version')
  })
})

describe('isAuthorizedHook', () => {
  it('Responds with 401 if api-key header does not match', async () => {
    const { data, status } = await request.get('/unicorn/42')

    expect(status).toBe(401)
    expect(data).toBeDefined()
    expect(data.message).toBeString()
  })
})

describe('errorHandler', () => {
  it('Responds with 404 for non-existing resources', async () => {
    const { data, status } = await request.get('/unicorn/42', {
      headers: { 'api-key': deppoFrontendApiKey },
    })

    expect(status).toBe(404)
    expect(data).toBeDefined()
    expect(data.message).toBeString()
    expect(data.code).toBe('E_NOT_FOUND')
  })
})
