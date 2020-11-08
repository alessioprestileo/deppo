import { v4 as uuidV4 } from 'uuid'
import Axios from 'axios'

import { FReply, FRequest } from '../types'

export async function bankIdMobile(request: FRequest, reply: FReply) {
  const {
    dateOfBirth,
    getSocialSecurityNumber = true,
    mobileNumber,
  } = request.body
  if (!dateOfBirth || !mobileNumber) {
    reply.status(400)
    reply.send({
      message: 'Missing date of birth or mobile number',
      code: 'BAD_REQUEST',
    })
  }
  const { authorization } = request.headers
  const url = 'https://api.idfy.io/identification/no/bankid/mobile'
  const headers = { Authorization: authorization }
  const body = {
    DateOfBirth: dateOfBirth,
    MobileNumber: mobileNumber,
    GetSocialSecurityNumber: getSocialSecurityNumber,
    ExternalReference: uuidV4(),
    Addonservices: {
      'no.personal.info': '',
    },
  }
  const res = await Axios({
    method: 'POST',
    url,
    headers,
    data: body,
  })
  reply.send(res.data)
}
