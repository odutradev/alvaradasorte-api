import userRepository from '@module/repositories/user/index'
import defineAction from '@core/factories/defineAction'
import { syncUserSchema, userSchema } from './schemas'

import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'
import type { SyncUserRequest, UserResponse } from './types'

export const syncAuthUser = defineAction(
  {
    method: 'post',
    path: '/iam/v1/auth/sync',
    summary: 'Sincronizar usuário logado via Frontend',
    tags: ['IAM - Autenticação'],
    authenticate: false,
    responses: {
      200: { description: 'Sucesso', schema: userSchema }
    }
  },
  async ({ data, manageError }: ManageRequestBody<SyncUserRequest>): ManageRequestResponse<UserResponse> => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        photoUrl: data.photoUrl ?? '',
        authProviderId: data.authProviderId ?? 'google'
      }

      const user = await userRepository.upsert(data.id, payload)

      return user
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: syncUserSchema }
)
