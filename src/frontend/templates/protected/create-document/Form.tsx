import React from 'react'
import { navigate } from 'gatsby'
import { useForm } from 'react-hook-form'

import { isClientSide } from '../../../shared/utils'
import { newDocumentTemplate } from './newDocumentTemplate'
import { createDocument } from '../../../services/document-service'
import { CreateDocumentPayload } from '../../../../shared/types'

type Inputs = {
  title: string
  description: string
  content: string
  email: string
}

type Props = {
  creatorId: string
  token: string
}

export const Form = ({ creatorId, token }: Props) => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const onSubmit = async ({
    title,
    description,
    content,
    email,
  }: Inputs): Promise<void> => {
    if (!isClientSide()) return

    const base64Content = window.btoa(content)
    const payload: CreateDocumentPayload = JSON.parse(
      JSON.stringify(newDocumentTemplate),
    )
    payload.dataToSign.base64Content = base64Content
    payload.dataToSign.description = description
    payload.dataToSign.title = title
    payload.signers[0].signerInfo.email = email
    const res = await createDocument({ token, userId: creatorId, payload })
    if (res.success) {
      navigate('/protected/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          <div>Title:</div>
          <input name="title" ref={register({ required: true })} />
          {errors.title && <span>This field is required</span>}
        </label>
      </div>
      <div>
        <label>
          <div>Description:</div>
          <input name="description" ref={register({ required: true })} />
          {errors.description && <span>This field is required</span>}
        </label>
      </div>
      <div>
        <label>
          <div>Content:</div>
          <input name="content" ref={register({ required: true })} />
          {errors.content && <span>This field is required</span>}
        </label>
      </div>
      <div>
        <label>
          <div>Tenant&apos;s email address:</div>
          <input name="email" ref={register({ required: true })} />
          {errors.email && <span>This field is required</span>}
        </label>
      </div>
      <input type="submit" />
    </form>
  )
}
