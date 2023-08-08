import { prisma } from '@/lib/prisma'
import { logError } from '@/utils/log-error'
import { Competitor } from '@prisma/client'

import puppeteer from 'puppeteer'

export class Scrapper {
  successCount = 0
  async execute({
    cardListUrl,
    postCardEl,
    postContentEl,
    postTitleEl,
    postImgEl,
    scrapingLimit,
    blogId,
    id,
  }: Competitor) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    console.log('\nBrowser launched...')

    await page.goto(cardListUrl)
    console.log(`\nNavigated to ${cardListUrl}`)

    await page.setViewport({ width: 1366, height: 900 })
    console.log('\nViewport set to 1366x900...')

    const postList = await page.evaluate((postCardEl) => {
      const nodeList = document.querySelectorAll(postCardEl)

      const elementArray = [...nodeList]

      const postList = elementArray.map((element: any) => ({
        url: element.href,
      }))

      return postList
    }, postCardEl)

    console.log('\nPosts urls collected...')

    const posts = []
    let index = 1

    for (const post of postList) {
      if (index > scrapingLimit) {
        break
      } else {
        await page.goto(post.url)
        console.log(`\nNavigated to ${post.url}`)

        const postData = await page.evaluate(
          (postTitleEl, postContentEl, postImgEl) => {
            const title = document.querySelector(postTitleEl)?.innerHTML
            const content = document.querySelector(postContentEl)?.innerHTML
            let image

            image = document
              .querySelector<HTMLElement>(postImgEl)
              ?.style.backgroundImage.slice(5, -2)

            if (!image) {
              image = document.querySelector<HTMLImageElement>(postImgEl)?.src
            }

            return {
              title: title || '',
              content: content || '',
              referencePostUrl: window.location.href,
              img: image || '',
            }
          },
          postTitleEl,
          postContentEl,
          postImgEl,
        )

        if (!postData.title || !postData.content) {
          logError('\nTitle or Content not found')
        } else {
          this.successCount++
          console.log('\nGot data!')
          posts.push(postData)
        }
        index++
      }
    }

    await browser.close()

    console.log(
      `\nScraping succeeded at ${this.successCount} of ${postList.length}`,
    )

    this.successCount = 0

    posts.forEach(async (post) => {
      const isDuplicated = await prisma.post.findFirst({
        where: {
          refUrl: post.referencePostUrl,
        },
      })

      if (isDuplicated) {
        logError(`\nPost already exists! reference: ${isDuplicated.refUrl}`)
        console.log(
          `\nAdded ${this.successCount} of ${postList.length} posts to database`,
        )
      } else {
        await prisma.post.create({
          data: {
            refTitle: post.title,
            refContent: post.content,
            refUrl: post.referencePostUrl,
            refImage: post.img,
            blogId,
            competitorId: id,
          },
        })

        this.successCount++

        console.log(
          `\nAdded ${this.successCount} of ${postList.length} posts to database`,
        )
      }
    })
  }
}
