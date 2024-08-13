import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'
import { logError } from '@/utils/log-error'

export async function runScrapper() {
  const competitors = await prisma.competitor.findMany({
    where: {
      // [DEBUG] Test specific competitor
      // id: `e4dfe2e0-38f9-43fb-be66-9f482e939f57`, // Portal do Franchising
    },
  })

  if (competitors.length < 1) {
    logError(`Competitors not found!`)
  }

  for (const [index, competitor] of competitors.entries()) {
    // [DEBUG] Skip one or more competitors
    // if (
    //   // competitor.id === 'e15073ec-4207-4863-a1a5-5d9b4cb32d21' // Supervarejo
    // ) {
    //   continue
    // }

    try {
      console.log(
        `\nScrapper queue: ${index + 1} of ${competitors.length} [ ${
          competitor.name
        }]`,
      )
      const scrapper = new Scrapper()
      await scrapper.execute(competitor)
    } catch (error: any) {
      logError(error, undefined, competitor)
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else {
        console.log(error.message)
      }
      console.log(
        `
        -------- Skipping ${competitor.name} due to error...--------
        `,
      )
      continue
    }
  }
}
