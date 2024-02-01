import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'
import { logError } from '@/utils/log-error'

export async function runScrapper() {
  const competitors = await prisma.competitor.findMany({
    where: {
      // id: `3b481201-c54e-4529-b345-bcbbb675ccf0`, // Petlove (Bem estar)
      // id: `af96d034-c20d-4a40-8761-0194ecc1914d`, // Tecnoblog
    },
  })

  if (competitors.length < 1) {
    logError(`Competitors not found!`)
  }

  for (const [index, competitor] of competitors.entries()) {
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
        `\n -------- Skipping ${competitor.name} due to error...--------\n`,
      )
      continue
    }
  }
}
