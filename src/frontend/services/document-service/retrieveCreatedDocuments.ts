import axios, { AxiosResponse } from 'axios'

export type RetrieveAllDocumentsParams = {
  token: string
  userId: string
}

export async function retrieveCreatedDocuments({
  token,
  userId,
}: RetrieveAllDocumentsParams): Promise<AxiosResponse<any>> {
  return axios({
    url: '/.netlify/functions/retrieveCreatedDocuments',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data: { userId },
  })
}
