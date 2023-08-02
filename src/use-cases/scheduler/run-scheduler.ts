import { prisma } from '@/lib/prisma'
import { Scheduler } from './scheduler'

//
;(async () => {
  const scheduler = new Scheduler()
  const posts = await prisma.post.findMany({
    where: {
      status: 'Ready',
    },
  })
  if (!posts) {
    throw new Error('Posts not found!')
  }

  let index = 1

  for (const post of posts) {
    try {
      console.log(`\nQueue: ${index} of ${posts.length}`)
      await scheduler.execute(post)

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
})()
