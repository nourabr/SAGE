import { prisma } from '@/lib/prisma'
import { Scrapper } from './scrapper'

//
;(async () => {
  const scrapper = new Scrapper()

  const competitors = await prisma.competitor.findMany()

  if (competitors.length < 1) {
    console.log('Posts not found!')
  }

  for (const competitor of competitors) {
    await scrapper.execute(competitor)
  }
})()
