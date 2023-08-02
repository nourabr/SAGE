import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { clearHTMLTags } from '@/utils/clear-html-tags'
import { dayAdder } from '@/utils/day-adder'
import { Post } from '@prisma/client'
import axios from 'axios'

export class Scheduler {
  async execute({ blogId, id, content, title }: Post) {
    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
    })

    if (!blog) {
      throw new Error('Blog not found!')
    }

    // Data schema
    // const dataSchema = z.object({
    //   status: z.enum(['publish', 'future', 'draft', 'pending', 'private']),
    //   title
    // })

    // Post Data
    // const data = {
    //   status: 'draft',
    // }

    console.log(`${dayAdder()}`)

    // Criar requisição
    const reply = await axios.post(
      `${blog.url}/wp-json/wp/v2/posts`,
      {
        status: 'future',
        title: clearHTMLTags(title),
        content,
        date: dayAdder(),
      },
      {
        auth: {
          username: env.BLOG_USER,
          password: blog.password,
        },
      },
    )

    if (reply.status !== 201) {
      throw new Error('')
    }

    console.log(`Post ${id} scheduled with success!`)
    return reply
  }
}
