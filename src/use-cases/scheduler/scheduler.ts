import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { clearHTMLTags } from '@/utils/clear-html-tags'
import { dayAdder } from '@/utils/day-adder'
import { logError } from '@/utils/log-error'
import { Post } from '@prisma/client'
import axios from 'axios'

export class Scheduler {
  postDate = new Date()
  publishDate = new Date()
  limit = dayAdder(7).getDate()
  hour = 12

  async execute({
    blogId,
    id,
    content,
    title,
    featuredMedia,
    competitorId,
  }: Post) {
    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
    })

    const competitor = await prisma.competitor.findFirst({
      where: {
        id: competitorId,
      },
    })

    if (!blog || !competitor) {
      const message = '\nBlog or Competitor not found!'
      logError(message)
      throw new Error(message)
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
        featured_media: featuredMedia,
        categories: [competitor.blogCategoryId],
      },
      {
        auth,
      },
    )

    const postUrl = `${reply.data.permalink_template.replace(
      '%postname%',
      reply.data.slug,
    )}`

    if (reply.status !== 201) {
      throw new Error('')
    }

    await prisma.post.update({
      where: {
        id,
      },
      data: {
        status: 'Posted',
        url: postUrl,
      },
    })

    console.log(`\nPost ${id} scheduled with success!\nLink: ${postUrl}`)
    return reply
  }
}
