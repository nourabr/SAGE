import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'
import { logError } from '@/utils/log-error'

export async function runScrapper() {
  const timeout = 15000

  const competitors = await prisma.competitor.findMany({
    where: {
      // id: `5debb05b-f142-42ea-bc8a-a7793eca6c09`, // Cobasi (Jardinagem)
    },
  })

  if (competitors.length < 1) {
    logError(`Competitors not found!`)
  }

  for (const [index, competitor] of competitors.entries()) {
    try {
      setTimeout(async () => {
        console.log(
          `\nScrapper queue: ${index + 1} of ${competitors.length} [ ${
            competitor.name
          }]`,
        )
        const scrapper = new Scrapper()
        await scrapper.execute(competitor)
      }, index * timeout)
    } catch (error: any) {
      logError(error, undefined, competitor)
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else {
        console.log(error.message)
      }
    }
  }
}

// runScrapper()
