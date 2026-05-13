import defaultModuleRouter from '@module/routes/index'

import type { AppModule } from '@core/types/module'

const defaultModule: AppModule = {
  name: 'defaultModule',
  router: defaultModuleRouter,
  routePrefix: '/'
}

export default defaultModule