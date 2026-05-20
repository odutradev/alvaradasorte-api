import { Router } from 'express'

import { syncAuthUser, updateMe, getMe } from '@module/actions/auth/index'
import authMiddleware from '@module/middlewares/auth'

const defaultModuleRouter = Router()

defaultModuleRouter.post('/auth/sync', syncAuthUser)
defaultModuleRouter.patch('/auth/me', authMiddleware, updateMe)
defaultModuleRouter.get('/auth/me', authMiddleware, getMe)

export default defaultModuleRouter