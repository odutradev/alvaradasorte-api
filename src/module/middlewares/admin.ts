import userRepository from '@module/repositories/user/index'
import sendError from '@core/error/index'

import type { NextFunction, Response, Request } from 'express'

const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = res.locals?.userId

  if (!userId) {
    sendError({ code: 'unauthorized', res, local: 'adminMiddleware' })
    return
  }

  try {
    const user = await userRepository.findById(userId)

    if (!user || user.role !== 'admin') {
      sendError({ code: 'forbidden', res, local: 'adminMiddleware' })
      return
    }

    next()
  } catch (error) {
    sendError({ code: 'internal_error', res, error, local: 'adminMiddleware' })
  }
}

export default adminMiddleware