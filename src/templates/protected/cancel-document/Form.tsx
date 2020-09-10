import React from 'react'
import { navigate } from 'gatsby'
import { useForm } from 'react-hook-form'

import { cancelDocument } from '../../../services/document-service'

type Inputs = {
  documentId: string
  reason: string
}

type Props = {
  creatorId: string
  token: string
}

export const Form = ({ creatorId, token }: Props) => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const onSubmit = async ({ documentId, reason }: Inputs): Promise<void> => {
    const payload = { creatorId, documentId, reason }
    const res = await cancelDocument({ token, payload })
    if (res.success) {
      navigate('/protected/documents-list')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          <div>Document id:</div>
          <input name="documentId" ref={register({ required: true })} />
          {errors.documentId && <span>This field is required</span>}
        </label>
      </div>
      <div>
        <label>
          <div>Reason:</div>
          <input
            name="reason"
            defaultValue="The agreement is no longer valid"
            ref={register}
          />
        </label>
      </div>
      <input type="submit" />
    </form>
  )
}
