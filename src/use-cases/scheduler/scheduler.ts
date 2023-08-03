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

    const auth = {
      username: env.BLOG_USER,
      password: blog.password,
    }

    const postList = await axios.get(`${blog.url}/wp-json/wp/v2/posts`, {
      auth,
      data: {
        status: 'future',
        order: 'desc',
      },
    })

    // console.log(postList.data)

    let newPostDate = new Date()
    // Percorrer a lista de posts e verificar qual a maior data

    for (const lastPost of postList.data) {
      const lastPostDay = new Date(lastPost.date).getDate()
      const newPostDay = new Date(newPostDate).getDate()

      if (lastPostDay > newPostDay) {
        newPostDate = new Date(lastPost.date)
      }
    }
    // Adicionar d+1 para a maior data
    const publishDate = dayAdder(1, newPostDate)
    // Postar sempre ao meio dia
    // Se houver mais de 7 posts agendados, postar imediatamente
    // Mudar status do post quando retornar 201

    const reply = await axios.post(
      `${blog.url}/wp-json/wp/v2/posts`,
      {
        status: 'future',
        title: clearHTMLTags(title),
        content,
        date: publishDate,
      },
      {
        auth,
      },
    )

    if (reply.status !== 201) {
      throw new Error('')
    }

    console.log(`Post ${id} scheduled with success!`)
    return reply
  }
}
