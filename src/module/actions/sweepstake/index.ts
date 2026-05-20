import participationRepository from '@module/repositories/participation/index'
import sweepstakeRepository from '@module/repositories/sweepstake/index'
import userRepository from '@module/repositories/user/index'
import defineAction from '@core/factories/defineAction'
import { isPast } from '@core/utils/date'
import { listSweepstakesResponseSchema, sweepstakeDetailsSchema, createSweepstakeSchema, joinSweepstakeSchema, sweepstakeParamsSchema, sweepstakeSchema } from './schemas'

import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'
import type { SweepstakeDetailsResponse, CreateSweepstakeRequest, ListSweepstakesResponse, JoinSweepstakeRequest, SweepstakeParamsRequest, SweepstakeResponse } from './types'

export const listSweepstakes = defineAction(
  {
    method: 'get',
    path: '/iam/v1/sweepstakes',
    summary: 'Listar bolões disponíveis',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: listSweepstakesResponseSchema }
    }
  },
  async ({ manageError }: ManageRequestBody): ManageRequestResponse<ListSweepstakesResponse> => {
    try {
      const sweepstakes = await sweepstakeRepository.findAll()

      return sweepstakes
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  }
)

export const createSweepstake = defineAction(
  {
    method: 'post',
    path: '/iam/v1/sweepstakes',
    summary: 'Criar bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: sweepstakeSchema }
    }
  },
  async ({ ids, data, manageError }: ManageRequestBody<CreateSweepstakeRequest>): ManageRequestResponse<SweepstakeResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const payload = { ...data, adminId: ids.userId }
      const sweepstake = await sweepstakeRepository.create(payload)

      return sweepstake
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: createSweepstakeSchema }
)

export const getSweepstakeDetails = defineAction(
  {
    method: 'get',
    path: '/iam/v1/sweepstakes/{id}/details',
    summary: 'Detalhes completos do bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: sweepstakeDetailsSchema }
    }
  },
  async ({ params, manageError }: ManageRequestBody<SweepstakeParamsRequest>): ManageRequestResponse<SweepstakeDetailsResponse> => {
    try {
      const [sweepstake, participations] = await Promise.all([
        sweepstakeRepository.findById(params.id),
        participationRepository.findBySweepstakeId(params.id)
      ])

      if (!sweepstake) return manageError({ code: 'not_found' })

      return { ...sweepstake, participations }
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema }
)

export const joinSweepstake = defineAction(
  {
    method: 'post',
    path: '/iam/v1/sweepstakes/{id}/join',
    summary: 'Entrar em um bolão',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<JoinSweepstakeRequest>): ManageRequestResponse => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const [user, sweepstake, existing] = await Promise.all([
        userRepository.findById(ids.userId),
        sweepstakeRepository.findById(params.id),
        participationRepository.findByUserAndSweepstake(ids.userId, params.id)
      ])

      if (!user) return manageError({ code: 'user_not_found' })
      if (!sweepstake) return manageError({ code: 'not_found' })
      if (existing) return manageError({ code: 'conflict', details: 'Usuário já participa deste bolão' })
      
      const missingProfileInfo = !user.fullName || !user.department || !user.phone

      if (missingProfileInfo) return manageError({ code: 'bad_request', details: 'Perfil incompleto. Preencha nome completo, setor e telefone.' })
      
      const isClosed = isPast(new Date(sweepstake.purchaseLimitDate))

      if (isClosed) return manageError({ code: 'bad_request', details: 'Data limite para compra excedida' })

      const participations = await participationRepository.findBySweepstakeId(params.id)
      const noQuotas = participations.length >= sweepstake.availableQuotas

      if (noQuotas) return manageError({ code: 'bad_request', details: 'Cotas esgotadas' })

      const payload = {
        sweepstakeId: params.id,
        userId: user.id,
        userName: user.fullName as string,
        receiptUrl: data.receiptUrl
      }

      await participationRepository.create(payload)
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: joinSweepstakeSchema, params: sweepstakeParamsSchema }
)