import 'dotenv/config'

import userRepository from '@module/repositories/user/index'
import createLogger from '@core/utils/logger'

const logger = createLogger('make-admin')

const makeAdmin = async (): Promise<void> => {
  const email = process.argv[2]

  if (!email) {
    logger.error('Forneça o email do usuário como argumento. Ex: npm run script make-admin user@email.com')
    process.exit(1)
  }

  try {
    const user = await userRepository.findByEmail(email)

    if (!user) {
      logger.error(`Usuário com email ${email} não encontrado.`)
      process.exit(1)
    }

    await userRepository.update(user.id, { role: 'admin' })

    logger.success(`Usuário ${user.name} (${email}) atualizado para admin com sucesso!`)
    process.exit(0)
  } catch (error) {
    logger.error('Erro ao atualizar usuário:', error)
    process.exit(1)
  }
}

makeAdmin()