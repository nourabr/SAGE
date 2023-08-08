import { prisma } from '@/lib/prisma'
import { Scheduler } from './scheduler'
import { logError } from '@/utils/log-error'

export async function runScheduler() {
  const scheduler = new Scheduler()
  const posts = await prisma.post.findMany({
    where: {
      status: 'Ready',
    },
  })
  if (posts.length < 1) {
    logError(`Couldn't find posts with status 'Ready'!`)
  }

  let index = 1

  for (const post of posts) {
    try {
      console.log(`\nQueue: ${index} of ${posts.length}`)
      await scheduler.execute(post)

      index++
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

runScheduler()
