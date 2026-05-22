import { Router } from 'express'

import { setSweepstakeResult, addSweepstakeGames, getSweepstakeDetails, createSweepstake, listSweepstakes, joinSweepstake } from '@module/actions/sweepstake/index'
import { updatePreset, createPreset, deletePreset, listPresets } from '@module/actions/preset/index'
import { syncAuthUser, updateMe, getMe } from '@module/actions/auth/index'
import adminMiddleware from '@module/middlewares/admin'
import authMiddleware from '@module/middlewares/auth'

const defaultModuleRouter = Router()

defaultModuleRouter.post('/auth/sync', syncAuthUser)
defaultModuleRouter.patch('/auth/me', authMiddleware, updateMe)
defaultModuleRouter.get('/auth/me', authMiddleware, getMe)

defaultModuleRouter.get('/presets', authMiddleware, adminMiddleware, listPresets)
defaultModuleRouter.post('/presets', authMiddleware, adminMiddleware, createPreset)
defaultModuleRouter.patch('/presets/:id', authMiddleware, adminMiddleware, updatePreset)
defaultModuleRouter.delete('/presets/:id', authMiddleware, adminMiddleware, deletePreset)

defaultModuleRouter.get('/sweepstakes', authMiddleware, listSweepstakes)
defaultModuleRouter.post('/sweepstakes', authMiddleware, adminMiddleware, createSweepstake)
defaultModuleRouter.get('/sweepstakes/:id/details', authMiddleware, adminMiddleware, getSweepstakeDetails)
defaultModuleRouter.post('/sweepstakes/:id/join', authMiddleware, joinSweepstake)
defaultModuleRouter.patch('/sweepstakes/:id/games', authMiddleware, adminMiddleware, addSweepstakeGames)
defaultModuleRouter.patch('/sweepstakes/:id/result', authMiddleware, adminMiddleware, setSweepstakeResult)

export default defaultModuleRouter
