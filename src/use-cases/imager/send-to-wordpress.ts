import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { clearHTMLTags } from '@/utils/clear-html-tags'
import { logError } from '@/utils/log-error'
import axios from 'axios'
import fs from 'node:fs'

export async function sendToWordpress(
  imageURL: string,
  blogId: string,
  postId: number,
  title: string,
) {
  //
  const blog = await prisma.blog.findFirst({
    where: {
      id: blogId,
    },
  })

  if (!blog) {
    throw new Error('\nBlog not found!')
  }

  const getImageFromUrl = await axios.get(imageURL, {
    responseType: 'arraybuffer',
  })

  const postTitle = clearHTMLTags(title)
  const outputPath = `./img/${postId}.png`

  fs.writeFile(outputPath, getImageFromUrl.data, (err) => {
    if (err) {
      console.log('\nError trying to write file to disk!')
    }

    console.log('\nOpenAI image saved to tmp folder!')

    console.log('\nRequesting Wordpress...')

    axios
      .post(
        `${blog.url}/wp-json/wp/v2/media`,
        {
          title: postTitle,
          alt_text: postTitle,
          description: postTitle,
          file: fs.createReadStream(outputPath),
        },
        {
          auth: {
            username: env.BLOG_USER,
            password: blog.password,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(async ({ data }) => {
        console.log(`\nUploaded image ${data.id} to Wordpress!`)

        // Upload id to db
        const isUpdated = await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            featuredMedia: data.id,
            status: 'Ready',
          },
        })

        if (!isUpdated) {
          const message = 'Update error on send-to-wordpress file!'
          logError(message)
          throw new Error(message)
        }
      })
  })
}
