import { Router } from 'express'

import { syncAuthUser } from '@module/actions/auth/index'

const defaultModuleRouter = Router()

defaultModuleRouter.post('/auth/sync', syncAuthUser)

export default defaultModuleRouter
