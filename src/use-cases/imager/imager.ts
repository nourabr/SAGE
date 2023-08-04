import { Post } from '@prisma/client'
import sharp from 'sharp'
import axios from 'axios'
import fs from 'node:fs'
import { env } from '@/env'

export class Imager {
  async execute({ id, refImage }: Post) {
    const reply = axios.get(refImage, {
      responseType: 'arraybuffer',
    })

    console.log(`\nPreparing image...`)
    const localImgPath = `./img/${id}.png`

    sharp((await reply).data)
      .png({
        quality: 80,
      })
      .ensureAlpha(0.99)
      .resize(512, 512)
      .toFile(localImgPath)
      .then((info) => {
        console.log(`\nReady for DALL-E`)
      })
      .catch((err) => {
        console.log(`Something went wrong: ${err}`)
      })

    console.log('Requesting OpenAI...')

    // Create a form and append image and fields
    fs.readFile(localImgPath, async (err, img) => {
      const form = new FormData()
      form.append('size', '256x256')
      form.append('image', new Blob([img]))

      const response = await axios.post(
        'https://api.openai.com/v1/images/variations',
        form,
        {
          headers: {
            Authorization: `Bearer ${env.OPEN_AI_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (!response) {
        console.log(`Something went wrong: ${err}`)
      }
    })

    // const openAIReply = await axios
    //   .post(
    //     'https://api.openai.com/v1/images/variations',
    //     {
    //       image: fs.createReadStream(localImgPath),
    //       size: '256x256',
    //       // image: fs.createReadStream(localImgPath),
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${env.OPEN_AI_KEY}`,
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     },
    //   )
    //   .then(({ data }) => console.log(data))

    // console.log(openAIReply)
    console.log('Opa')
    // if (!openAIReply) {
    //   throw new Error('Error making openAI request')
    // }

    // Receber url da imagem
  }
}
// Enviar para o wp
// Salvar id da imagem no banco

// Usar o id em featured_media no scheduler
