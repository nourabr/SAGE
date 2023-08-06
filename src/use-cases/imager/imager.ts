import { Post } from '@prisma/client'
import sharp from 'sharp'
import axios from 'axios'
import fs from 'node:fs'
import { env } from '@/env'
import { sendToWordpress } from './send-to-wordpress'

export class Imager {
  async execute({ id, refImage, blogId, title }: Post) {
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
        console.log(`\nReady for DALL-E`)
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
            console.log(`\nOpenAI Request error: ${err}`)
          }

          // Receber url da imagem
          const generatedImageUrl = JSON.stringify(
            openAIReply.data.data[0].url,
          ).slice(1, -1)

          // Envia pro Wordpress e salva no banco
          await sendToWordpress(generatedImageUrl, blogId, id, title)

          console.log(`\nImager work done with success!`)
        })
      })
      .catch((err) => {
        console.log(`\nSomething went wrong: ${err}`)
      })
  }
}
