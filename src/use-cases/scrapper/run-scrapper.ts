import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'
import { logError } from '@/utils/log-error'

export async function runScrapper() {
  const competitors = await prisma.competitor.findMany({
    where: {
      // [DEBUG] Test specific competitor
      // id: `d3775efb-233c-4fe4-ba4a-fb51e36407fb`, // Passagens Promo (Dicas de Viagem)
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
