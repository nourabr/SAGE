import { Post } from '@prisma/client'
import sharp from 'sharp'
import axios from 'axios'
import fs from 'node:fs'
import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { sendToWordpress } from './send-to-wordpress'

export class Imager {
  async execute({ id, refImage, blogId }: Post) {
    const getImageFromRef = axios.get(refImage, {
      responseType: 'arraybuffer',
    })

    console.log(`\nPreparing image...`)
    const localImgPath = `./img/${id}.png`

    sharp((await getImageFromRef).data)
      .ensureAlpha(0.99)
      .resize(512, 512)
      .toFile(localImgPath)
      .then((data) => {
        console.log(`\nReady for DALL-E`)
        fs.readFile(localImgPath, async (err, img) => {
          const form = new FormData()
          form.append('size', '256x256')
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
            console.log(`OpenAI Request error: ${err}`)
          }

          // Receber url da imagem
          const generatedImageUrl = JSON.stringify(
            openAIReply.data.data[0].url,
          ).slice(1, -1)

          // Envia pro Wordpress
          const wpImageId = await sendToWordpress(generatedImageUrl, blogId)

          // Salvar id retornado da imagem no banco
          // Usar o id em featured_media no scheduler

          console.log(generatedImageUrl)
        })
      })
      .catch((err) => {
        console.log(`Something went wrong: ${err}`)
      })
  }
}
