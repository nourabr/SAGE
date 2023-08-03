import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { clearHTMLTags } from '@/utils/clear-html-tags'
import { dayAdder } from '@/utils/day-adder'
import { Post } from '@prisma/client'
import axios from 'axios'

export class Scheduler {
  postDate = new Date()
  publishDate = new Date()
  limit = dayAdder(7).getDate()
  hour = 12

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

    const wpPosts = await axios.get(`${blog.url}/wp-json/wp/v2/posts`, {
      auth,
      data: {
        status: 'future',
        order: 'desc',
      },
    })

    for (const wpPost of wpPosts.data) {
      const wpPostDay = new Date(wpPost.date).getDate()
      const currentPostDay = new Date(this.postDate).getDate()

      if (wpPostDay > currentPostDay) {
        this.postDate = new Date(wpPost.date)
      }
    }

    if (this.postDate.getDate() >= this.limit) {
      this.publishDate = new Date(this.publishDate.setHours(this.hour))
    } else {
      this.publishDate = new Date(
        dayAdder(1, this.postDate).setHours(this.hour),
      )
    }

    const reply = await axios.post(
      `${blog.url}/wp-json/wp/v2/posts`,
      {
        status: 'future',
        title: clearHTMLTags(title),
        content,
        date: this.publishDate,
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
