import { listSweepstakesResponseSchema, listSweepstakesQuerySchema, sweepstakeDetailsSchema, createSweepstakeSchema, sweepstakeParamsSchema, sweepstakeSchema } from './schemas'
import participationRepository from '@module/repositories/participation/index'
import sweepstakeRepository from '@module/repositories/sweepstake/index'
import userRepository from '@module/repositories/user/index'
import { firebaseStorage } from '@core/database/connection'
import defineAction from '@core/factories/defineAction'
import upload from '@core/middlewares/upload'
import { isPast } from '@core/utils/date'

import type { SweepstakeDetailsResponse, CreateSweepstakeRequest, ListSweepstakesResponse, ListSweepstakesRequest, JoinSweepstakeRequest, SweepstakeParamsRequest, SweepstakeResponse } from './types'
import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'

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
  async ({ ids, query, manageError }: ManageRequestBody<ListSweepstakesRequest>): ManageRequestResponse<ListSweepstakesResponse> => {
    try {
      const [sweepstakes, participations] = await Promise.all([
        sweepstakeRepository.findAll(),
        participationRepository.findAll()
      ])

      const targetUserId = query?.userId ?? ids.userId

      const mappedSweepstakes = sweepstakes.map((sweepstake) => {
        const sweepstakeParticipations = participations.filter((p) => p.sweepstakeId === sweepstake.id)
        const filledQuotas = sweepstakeParticipations.length

        const userParticipationRecord = sweepstakeParticipations.find((p) => p.userId === targetUserId)

        const userParticipation = targetUserId
          ? {
              isParticipant: !!userParticipationRecord,
              joinedAt: userParticipationRecord?.createdAt ?? null
            }
          : undefined

        return {
          ...sweepstake,
          metadata: {
            filledQuotas
          },
          ...(userParticipation && { userParticipation })
        }
      })

      return mappedSweepstakes
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { query: listSweepstakesQuerySchema }
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
    middlewares: [upload.single('receipt')],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: { receipt: { type: 'string', format: 'binary' } }
          }
        }
      }
    },
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ ids, params, file, manageError }: ManageRequestBody<JoinSweepstakeRequest>): ManageRequestResponse => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })
    if (!file) return manageError({ code: 'bad_request', details: 'Comprovante não enviado' })

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

      const bucket = firebaseStorage.bucket()
      const fileExtension = file.originalname.split('.').pop()
      const filePath = `receipts/${params.id}/${ids.userId}-${Date.now()}.${fileExtension}`
      const fileRef = bucket.file(filePath)

      await fileRef.save(file.buffer, { metadata: { contentType: file.mimetype } })

      const payload = {
        sweepstakeId: params.id,
        userId: user.id,
        userName: user.fullName as string,
        receiptUrl: filePath
      }

      await participationRepository.create(payload)
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema }
)