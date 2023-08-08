import { prisma } from '@/lib/prisma'
import { Competitor, Post } from '@prisma/client'

export async function logError(
  error: any,
  post?: Post,
  competitor?: Competitor,
) {
  prisma.log.create({
    data: {
      message: `${error}`,
      postId: post ? post.id : undefined,
      competitorId: competitor ? competitor.id : undefined,
    },
  })

  console.log(`${error}`)
}
