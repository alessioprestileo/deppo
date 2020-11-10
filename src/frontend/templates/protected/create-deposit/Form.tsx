import React from 'react'
import { navigate } from 'gatsby'
import { useForm } from 'react-hook-form'

import { isClientSide } from '../../../shared/utils'
import { newDepositTemplate } from './newDepositTemplate'
import { createDeposit } from '../../../services/deposit-service'
import { CreateDepositPayload } from '../../../../shared/types'

type Inputs = {
  email: string
}

type Props = {
  creatorId: string
  token: string
}

export const Form = ({ creatorId, token }: Props) => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const onSubmit = async ({ email }: Inputs): Promise<void> => {
    if (!isClientSide()) return

    const payload: CreateDepositPayload = JSON.parse(
      JSON.stringify(newDepositTemplate),
    )
    payload.tenants[0].info.email = email
    const res = await createDeposit({ token, userId: creatorId, payload })
    if (res.success) {
      navigate('/protected/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
