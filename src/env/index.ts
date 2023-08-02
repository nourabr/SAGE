import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  OPEN_AI_KEY: z.string(),
  OPEN_AI_PRE_TEXT: z.string(),
  BLOG_USER: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('🔴 Invalid environment variables', _env.error.format())

  throw new Error('🔴 Invalid environment variables')
}

export const env = _env.data
