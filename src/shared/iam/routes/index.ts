import { Router } from 'express'

import { syncAuthUser } from '@shared/iam/actions/auth/index'

const iamRouter = Router()

iamRouter.post('/auth/sync', syncAuthUser)

export default iamRouter