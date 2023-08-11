import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'
import { logError } from '@/utils/log-error'

export async function runScrapper() {
  const scrapper = new Scrapper()

  const competitors = await prisma.competitor.findMany({
    // where: {
    //   id: `c4b11711-e011-4c87-b2e4-9307a1b21389`,
    // },
  })

  if (competitors.length < 1) {
    logError(`Competitors not found!`)
  }

  for (const [index, competitor] of competitors.entries()) {
    try {
      setTimeout(async () => {
        console.log(`\nScrapper queue: ${index + 1} of ${competitors.length}`)
        await scrapper.execute(competitor)
      }, index * 10000)
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
