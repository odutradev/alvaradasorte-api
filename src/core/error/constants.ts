import type { ResponseError } from '@core/error/types'

export const ResponseErrors = {
  internal_error: { message: 'Erro interno no servidor', statusCode: 500 },
  validation_error: { message: 'Erro de validação dos dados', statusCode: 422 },
  unauthorized: { message: 'Acesso não autorizado', statusCode: 401 },
  forbidden: { message: 'Acesso negado', statusCode: 403 },
  bad_request: { message: 'Requisição malformada', statusCode: 400 },
  not_found: { message: 'Recurso não encontrado', statusCode: 404 },
  conflict: { message: 'Conflito de dados', statusCode: 409 },
  no_token: { message: 'Token de autenticação não fornecido', statusCode: 401 },
  token_is_not_valid: { message: 'Token de autenticação inválido ou expirado', statusCode: 401 },
  no_credentials_send: { message: 'Credenciais não enviadas na requisição', statusCode: 400 },
  invalid_credentials: { message: 'Credenciais inválidas', statusCode: 401 },
  user_not_found: { message: 'Usuário não localizado no sistema', statusCode: 404 }
} as const