import { prisma } from '@/lib/prisma'
import { Scheduler } from './scheduler'
import { logError } from '@/utils/log-error'

export async function runScheduler() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'Ready',
    },
  })
  if (posts.length < 1) {
    logError(`Couldn't find posts with status 'Ready'!`)
  }

  for (const [index, post] of posts.entries()) {
    try {
      const scheduler = new Scheduler()
      console.log(`\nScheduler queue: ${index + 1} of ${posts.length}`)
      await scheduler.execute(post)
    } catch (error: any) {
      logError(error, post)
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else {
        console.log(error.message)
      }
    }
  }
}

// runScheduler()
