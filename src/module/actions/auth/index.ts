import userRepository from '@module/repositories/user/index'
import { firebaseAuth } from '@core/database/connection'
import defineAction from '@core/factories/defineAction'
import { syncUserSchema, userSchema } from './schemas'

import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'
import type { SyncUserRequest, UserResponse } from './types'

export const syncAuthUser = defineAction(
  {
    method: 'post',
    path: '/iam/v1/auth/sync',
    summary: 'Sincronizar usuário do Firebase Auth',
    tags: ['IAM - Autenticação'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: userSchema }
    }
  },
  async ({ ids, data, manageError }: ManageRequestBody<SyncUserRequest>): ManageRequestResponse<UserResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const firebaseUser = await firebaseAuth.getUser(ids.userId)
      
      const payload = {
        name: data.name ?? firebaseUser.displayName ?? '',
        email: data.email ?? firebaseUser.email ?? '',
        photoUrl: data.photoUrl ?? firebaseUser.photoURL ?? '',
        authProviderId: data.authProviderId ?? firebaseUser.providerData[0]?.providerId ?? 'password'
      }
      
      const user = await userRepository.upsert(ids.userId, payload)

      return user
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: syncUserSchema }
)