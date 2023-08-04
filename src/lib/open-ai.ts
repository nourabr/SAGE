import { env } from '@/env'
import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
  apiKey: env.OPEN_AI_KEY,
})

export const openAI = new OpenAIApi(config)
