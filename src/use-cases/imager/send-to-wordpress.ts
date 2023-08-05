import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import fs from 'node:fs'

export async function sendToWordpress(imageURL, blogId, postId) {
  //
  const blog = await prisma.blog.findFirst({
    where: {
      id: blogId,
    },
  })

  if (!blog) {
    throw new Error('\nBlog not found!')
  }

  const wpAuth = {
    username: env.BLOG_USER,
    password: blog.password,
  }

  // Download the content from URL
  const imageArrayBuffer = await axios.get(imageURL, {
    responseType: 'arraybuffer',
  })

  const outputPath = `./img/${postId}-ai.png`

  // Save file to img folder
  fs.writeFile(outputPath, await imageArrayBuffer.data, (err) => {
    if (err) {
      console.log('\nError trying to write file to disk!')
    }
    console.log('\nOpenAI image saved to tmp folder')

    // Read file
    fs.readFile(outputPath, async (err, img) => {
      if (err) {
        console.log('\nError trying to read file')
      }

      axios.post(`${blog.url}/wp-json/wp/v2/media`, {
        file: fs.createReadStream(img),
      }, {headers:}
      )

      // const form = new FormData()
      // form.append('img', new Blob([img]))

      // const wpReply = await axios.post(
      //   `${blog.url}/wp-json/wp/v2/media`,
      //   form,
      //   {
      //     auth: wpAuth,
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   },
      // )

      console.log(wpReply)
    })
  })

  // if (wpReply.status !== 201) {
  //   throw new Error('Something went wrong')
  // }
}
