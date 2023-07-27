import { prisma } from '@/lib/prisma'
import { Scrapper } from './scraping'

//
;(async () => {
  const scrapper = new Scrapper()

  const competitor = await prisma.competitor.findFirst()

  if (!competitor) {
    throw new Error('Competitors not found')
  }

  scrapper.execute(competitor)
})()
