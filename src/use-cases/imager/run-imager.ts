import { prisma } from '@/lib/prisma'
import { Imager } from './imager'
import { logError } from '@/utils/log-error'

//
export async function runImager() {
  const imager = new Imager()
  const posts = await prisma.post.findMany({
    where: {
      status: 'Waiting for Imager',
    },
  })

  if (posts.length < 1) {
    logError(`Couldn't find posts with status 'Waiting for Imager'!`)
  }

  for (const [index, post] of posts.entries()) {
    try {
      setTimeout(async () => {
        console.log(`\nImager queue: ${index + 1} of ${posts.length}`)
        await imager.execute(post)
      }, index * 20000)
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
