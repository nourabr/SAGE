import { prisma } from '@/lib/prisma'
import { Imager } from './imager'

//
;(async () => {
  const imager = new Imager()
  const posts = await prisma.post.findMany({
    where: {
      status: 'Waiting for Imager',
    },
  })

  if (posts.length < 1) {
    console.log('Posts not found!')
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
})()
