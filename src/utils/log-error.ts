import { Competitor, Post } from '@prisma/client'

export async function logError(
  error: any,
  post?: Post,
  competitor?: Competitor,
) {
  console.log(`${error}`)
}
