import { listUsersResponseSchema, updateUserSchema, userParamsSchema, userSchema } from './schemas'
import userRepository from '@module/repositories/user/index'
import defineAction from '@core/factories/defineAction'

import type { UpdateUserRequest, UserParamsRequest, ListUsersResponse, ListUsersRequest, UserResponse } from './types'
import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'

export const listUsers = defineAction(
  {
    method: 'get',
    path: '/iam/v1/users',
    summary: 'Listar usuários (Admin)',
    tags: ['IAM - Usuários'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: listUsersResponseSchema }
    }
  },
  async ({ query, manageError }: ManageRequestBody<ListUsersRequest>): ManageRequestResponse<ListUsersResponse> => {
    try {
      const result = await userRepository.findAll(query)

      return result
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  }
)

export const updateUser = defineAction(
  {
    method: 'patch',
    path: '/iam/v1/users/{id}',
    summary: 'Atualizar usuário (Admin)',
    tags: ['IAM - Usuários'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: userSchema }
    }
  },
  async ({ params, data, manageError }: ManageRequestBody<UpdateUserRequest>): ManageRequestResponse<UserResponse> => {
    try {
      const user = await userRepository.update(params.id, data)

      if (!user) return manageError({ code: 'user_not_found' })

      return user
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: updateUserSchema, params: userParamsSchema }
)

export const deleteUser = defineAction(
  {
    method: 'delete',
    path: '/iam/v1/users/{id}',
    summary: 'Remover usuário (Admin)',
    tags: ['IAM - Usuários'],
    authenticate: true,
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ params, manageError }: ManageRequestBody<UserParamsRequest>): ManageRequestResponse => {
    try {
      const deleted = await userRepository.delete(params.id)

      if (!deleted) return manageError({ code: 'user_not_found' })
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: userParamsSchema }
)
