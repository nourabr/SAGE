import { prisma } from '@/lib/prisma'
import { Rewriter } from './rewriter'

export async function runRewriter() {
  const rewriter = new Rewriter()
  const posts = await prisma.post.findMany({
    where: {
      status: 'Waiting',
    },
  })
  if (posts.length < 1) {
    console.log(`Couldn't find posts with status 'Waiting'!`)
  }

  let index = 1

  for (const post of posts) {
    try {
      console.log(`\nQueue: ${index} of ${posts.length}`)
      await rewriter.execute(post)

      index++
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else {
        console.log(error.message)
      }
    }
  }
}

runRewriter()
