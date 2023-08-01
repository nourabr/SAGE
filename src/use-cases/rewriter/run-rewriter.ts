import { prisma } from '@/lib/prisma'
import { Rewriter } from './rewriter'

//
;(async () => {
  const rewriter = new Rewriter()
  const posts = await prisma.post.findMany()
  if (!posts) {
    throw new Error('posts not found')
  }

  let index = 1

  for (const post of posts) {
    try {
      console.log(`Queue: ${index} of ${posts.length}`)
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
})()
