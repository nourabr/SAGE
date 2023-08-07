import { prisma } from '@/lib/prisma'
import { Imager } from './imager'

//
export async function runImager() {
  const imager = new Imager()
  const posts = await prisma.post.findMany({
    where: {
      status: 'Waiting for Imager',
    },
  })

  if (posts.length < 1) {
    console.log(`Couldn't find posts with status 'Waiting for Imager'!`)
  }

  let index = 1

  for (const post of posts) {
    try {
      console.log(`\nQueue: ${index} of ${posts.length}`)
      await imager.execute(post)

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

runImager()
