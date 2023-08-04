import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { openAI } from '@/lib/open-ai'
import { Post } from '@prisma/client'

export class Rewriter {
  async execute({ id, refTitle, refContent }: Post) {
    console.log('Requesting OpenAI...')

    const reply = await openAI.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
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
        timeout: 60000, // 1 minute
      },
    )

    if (!reply.data.choices[0].message) {
      throw new Error('Error making openAI request')
    }

    const replyContent = `${reply.data.choices[0].message.content}`

    const title = replyContent.split('\n', 1)[0]
    const content = replyContent.replace(title, '')

    const hasUpdated = await prisma.post.update({
      where: {
        id,
      },
      data: {
        status: 'Ready',
        title,
        content,
      },
    })

    if (!hasUpdated) {
      throw new Error('Error updating data')
    }

    console.log(`Post ${id} rewrited with success!`)

    return replyContent
  }
}
