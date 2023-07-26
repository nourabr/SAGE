import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentials } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const reqBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = reqBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    await authenticateService.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentials) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
