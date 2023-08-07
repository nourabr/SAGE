import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'

export async function runScrapper() {
  const scrapper = new Scrapper()

  const competitors = await prisma.competitor.findMany()

  if (competitors.length < 1) {
    console.log(`Competitors not found!`)
  }

  for (const competitor of competitors) {
    await scrapper.execute(competitor)
  }
}

runScrapper()
