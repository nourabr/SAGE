import { prisma } from '@/lib/prisma'
import { Scrapper } from './scraping'

//
;(async () => {
  const scrapper = new Scrapper()

  const competitors = await prisma.competitor.findMany()

  if (!competitors) {
    throw new Error('Competitors not found')
  }

  competitors.forEach((competitor) => {
    scrapper.execute(competitor)
  })
})()
