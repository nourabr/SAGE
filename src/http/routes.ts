import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    reply.send()
  })
}
