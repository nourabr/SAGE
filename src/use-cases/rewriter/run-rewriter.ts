import { prisma } from '@/lib/prisma'
import { Rewriter } from './rewriter'
import { logError } from '@/utils/log-error'

export async function runRewriter() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'Waiting',
    },
  })
  if (posts.length < 1) {
    logError(`Couldn't find posts with status 'Waiting'!`)
  }

  for (const [index, post] of posts.entries()) {
    try {
      const rewriter = new Rewriter()
      console.log(`\nRewriter queue: ${index + 1} of ${posts.length}`)
      await rewriter.execute(post)
    } catch (error: any) {
      logError(error, post)
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else {
        console.log(error.message)
      }

      console.log(`\n -------- Skipping ${post.id} due to error...--------\n`)
      continue
    }
  }
}
