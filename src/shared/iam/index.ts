import iamRouter from '@shared/iam/routes/index'

import type { AppModule } from '@core/types/module'

const iamModule: AppModule = {
  name: 'iam',
  router: iamRouter,
  routePrefix: '/iam/v1'
}

export default iamModule