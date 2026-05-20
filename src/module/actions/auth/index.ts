import jwt from 'jsonwebtoken'

import userRepository from '@module/repositories/user/index'
import defineAction from '@core/factories/defineAction'
import { syncResponseSchema, updateUserSchema, syncUserSchema, userSchema } from './schemas'

import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'
import type { SyncUserResponse, UpdateUserRequest, SyncUserRequest, UserResponse } from './types'

export const syncAuthUser = defineAction(
  {
    method: 'post',
    path: '/iam/v1/auth/sync',
    summary: 'Sincronizar usuário logado via Frontend',
    tags: ['IAM - Autenticação'],
    authenticate: false,
    responses: {
      200: { description: 'Sucesso', schema: syncResponseSchema }
    }
  },
  async ({ data, manageError }: ManageRequestBody<SyncUserRequest>): ManageRequestResponse<SyncUserResponse> => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        photoUrl: data.photoUrl ?? '',
        authProviderId: data.authProviderId ?? 'google'
      }

      const user = await userRepository.upsert(data.id, payload)
      const secret = process.env.JWT_SECRET ?? 'default-secret-key'
      const tokenPayload = { email: user.email, authProviderId: user.authProviderId }
      
      const token = jwt.sign(tokenPayload, secret, { subject: user.id, expiresIn: '7d' })

      return { user, token }
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: syncUserSchema }
)

export const getMe = defineAction(
  {
    method: 'get',
    path: '/iam/v1/auth/me',
    summary: 'Buscar dados do usuário logado',
    tags: ['IAM - Autenticação'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: userSchema }
    }
  },
  async ({ ids, manageError }: ManageRequestBody): ManageRequestResponse<UserResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const user = await userRepository.findById(ids.userId)

      if (!user) return manageError({ code: 'user_not_found' })

      return user
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  }
)

export const updateMe = defineAction(
  {
    method: 'patch',
    path: '/iam/v1/auth/me',
    summary: 'Atualizar dados do usuário logado',
    tags: ['IAM - Autenticação'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: userSchema }
    }
  },
  async ({ ids, data, manageError }: ManageRequestBody<UpdateUserRequest>): ManageRequestResponse<UserResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const user = await userRepository.update(ids.userId, data)

      if (!user) return manageError({ code: 'user_not_found' })

      return user
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: updateUserSchema }
)
