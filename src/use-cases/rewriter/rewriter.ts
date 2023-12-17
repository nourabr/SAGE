import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { openAI } from '@/lib/open-ai'
import { Post } from '@prisma/client'
import { logError } from '@/utils/log-error'

export class Rewriter {
  async execute({ id, refTitle, refContent }: Post) {
    let gptModel = 'gpt-3.5-turbo'

    if (refContent.length > 5000) {
      gptModel = 'gpt-3.5-turbo-16k'
    }

    console.log(`Using model: ${gptModel}`)
    console.log('Requesting OpenAI...')
    const reply = await openAI.createChatCompletion(
      {
        model: gptModel,
        max_tokens: gptModel === 'gpt-3.5-turbo' ? 2000 : 3000,
        temperature: 0.97,
        messages: [
          {
            role: 'user',
            content: `
              ${env.OPEN_AI_PRE_TEXT}
              ${refTitle}
              ${refContent}
            `,
          },
        ],
      },
      {
        timeout: 120000, // 2 minutes
      },
    )

    if (!reply.data.choices[0].message) {
      const message = 'Error making openAI request'
      logError(message)
      throw new Error(message)
    }

    const replyContent = `${reply.data.choices[0].message.content}`

    const title = replyContent.split('\n', 1)[0]
    const content = replyContent.replace(title, '')

    const hasUpdated = await prisma.post.update({
      where: {
        id,
      },
      data: {
        status: 'Waiting for Imager',
        title,
        content,
      },
    })

    if (!hasUpdated) {
      const message = 'Error updating data'
      logError(message)
      throw new Error(message)
    }

    console.log(`Post ${id} rewrited with success!`)

    return replyContent
  }
}
