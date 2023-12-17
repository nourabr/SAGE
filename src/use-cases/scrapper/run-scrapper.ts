import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'
import { logError } from '@/utils/log-error'

export async function runScrapper() {
  const timeout = 15000

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
    if (
      // Remoção temporária do Petlove, Tecnoblog e Supervarejo
      competitor.id === 'af96d034-c20d-4a40-8761-0194ecc1914d' ||
      competitor.id === '3b481201-c54e-4529-b345-bcbbb675ccf0' ||
      competitor.id === 'e15073ec-4207-4863-a1a5-5d9b4cb32d21'
    ) {
      continue
    }

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
