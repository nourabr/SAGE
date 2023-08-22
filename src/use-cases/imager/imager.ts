import { Post } from '@prisma/client'
import sharp from 'sharp'
import axios from 'axios'
import fs from 'node:fs'
import { env } from '@/env'
import { sendToWordpress } from './send-to-wordpress'
import { logError } from '@/utils/log-error'
import { prisma } from '@/lib/prisma'

export class Imager {
  async execute({ id, refImage, blogId, title }: Post) {
    if (!refImage) {
      const blog = await prisma.blog.findFirst({
        where: {
          id: blogId,
        },
      })

      if (!blog) {
        throw new Error('refImage and Blog not found!')
      }

      refImage = blog.defaultImage
    }

    const getImageFromRef = await axios.get(refImage, {
      responseType: 'arraybuffer',
    })

    console.log(`\nPreparing image...`)
    const localImgPath = `./img/${id}.png`

    sharp(getImageFromRef.data)
      .ensureAlpha(0.99)
      .resize(512, 512)
      .toFile(localImgPath)
      .then((data) => {
        console.log(`Ready for DALL-E`)
        fs.readFile(localImgPath, async (err, img) => {
          const form = new FormData()
          form.append('size', '1024x1024')
          form.append('image', new Blob([img]))

          console.log('Requesting OpenAI...')

          const openAIReply = await axios.post(
            'https://api.openai.com/v1/images/variations',
            form,
            {
              headers: {
                Authorization: `Bearer ${env.OPEN_AI_KEY}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          )

          if (!openAIReply) {
            logError(`\nOpenAI Request error: ${err}`)
          }

          const generatedImageUrl = JSON.stringify(
            openAIReply.data.data[0].url,
          ).slice(1, -1)

          await sendToWordpress(generatedImageUrl, blogId, id, title)
        })
      })
      .catch((err) => {
        logError(`\nSomething went wrong: ${err}`)
      })
  }
}
