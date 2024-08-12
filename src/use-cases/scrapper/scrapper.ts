import { prisma } from '@/lib/prisma'
import { logError } from '@/utils/log-error'
import { removeFromText } from '@/utils/remove-from-text'
import { Competitor } from '@prisma/client'

import puppeteer from 'puppeteer'

export class Scrapper {
  timeOutTime = 120000 // 2 Minutes
  successCount = 0
  lifeCycleEvent = 'load'
  async execute({
    cardListUrl,
    postCardEl,
    postContentEl,
    postTitleEl,
    postImgEl,
    scrapingLimit,
    blogId,
    id,
    unwantedTags,
    waitUntilEventName,
    name,
    wordsToRemove,
  }: Competitor) {
    if (waitUntilEventName) {
      this.lifeCycleEvent = waitUntilEventName
    }

    console.log(`[ ${name} ] Using event: ${this.lifeCycleEvent}`)

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    console.log(`[ ${name} ] Browser launched...`)

    await page.goto(cardListUrl, { timeout: this.timeOutTime })
    console.log(`[ ${name} ] Navigated to ${cardListUrl}`)

    await page.setViewport({ width: 1366, height: 900 })

    const postList = await page.evaluate((postCardEl) => {
      const nodeList = document.querySelectorAll(postCardEl)

      const elementArray = [...nodeList]

      const postList = elementArray.map((element: any) => ({
        url: element.href,
      }))

      return postList
    }, postCardEl)

    console.log(`[ ${name} ] Posts urls collected?...`)

    const posts = []

    for (const [index, post] of postList.entries()) {
      if (index + 1 > scrapingLimit) {
        break
      } else {
        await page.goto(post.url, {
          // @ts-ignore
          waitUntil: this.lifeCycleEvent,
          timeout: this.timeOutTime,
        })
        console.log(`[ ${name} ] Navigated to ${post.url}`)

        const postData = await page.evaluate(
          (postTitleEl, postContentEl, postImgEl, unwantedTags) => {
            const title = `<h1>${
              // @ts-ignore
              document.querySelector(postTitleEl)?.innerText
            }</h1>`
            const contentEl = document.querySelector(postContentEl)

            if (!contentEl) {
              throw new Error('ContentEl not found!')
            }

            let cleanContent = ''

            for (const element of contentEl.childNodes) {
              // @ts-ignore
              if (!element.innerText) {
                continue
              }
              // @ts-ignore // Skip content starting with <p>+
              if (element.innerText.substr(0, 1) === '+') {
                continue
              }
              // @ts-ignore
              let currentTag = element.localName
              let isCurrentTagUnwanted = false

              for (const unwantedTag of unwantedTags) {
                if (currentTag === unwantedTag) {
                  isCurrentTagUnwanted = true
                  break
                }
              }

              if (!isCurrentTagUnwanted) {
                if (currentTag === 'div') {
                  currentTag = 'p'
                }

                // @ts-ignore
                cleanContent += `<${currentTag}>${element.innerText}</${currentTag}>`
              }
            }

            const content = cleanContent

            let image

            // If image url on CSS
            image = document
              .querySelector<HTMLElement>(postImgEl)
              ?.style.backgroundImage.slice(5, -2)
            console.log(`This is a image from CSS: ${image}`)

            // If webp
            if (!image) {
              image =
                document.querySelector<HTMLImageElement>(postImgEl)?.dataset.src
              console.log(`This is a image from Webp format: ${image}`)
            }

            // If Lazyloaded
            if (!image) {
              image =
                document.querySelector<HTMLImageElement>(postImgEl)?.dataset
                  .lazySrc
              console.log(`This is a image from Lazyloading format: ${image}`)
            }

            // If image on img
            if (!image) {
              image = document.querySelector<HTMLImageElement>(postImgEl)?.src
              console.log(`This is a image from <img>: ${image}`)
            }

            // If <a> link
            if (!image) {
              image =
                document.querySelector<HTMLAnchorElement>('figure > a')?.href
              console.log(`This is a image from <a>: ${image}`)
            }

            // If <p><img>
            if (!image) {
              image = document.querySelector<HTMLImageElement>('p img')?.src
              console.log(`This is a image from <p><img>: ${image}`)
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
          unwantedTags,
        )

        if (!postData.title || !postData.content) {
          logError(`[ ${name} ] Title or Content not found
          Title: ${postData.title},
          Content: ${postData.content} `)
        } else {
          this.successCount++
          console.log(`[ ${name} ] Got data!`)
          posts.push(postData)
        }
      }
    }

    // [DEBUG] Comment it with Headless:false
    await browser.close()

    console.log(
      `[ ${name} ] Scraping succeeded at ${this.successCount} of ${
        postList.length <= scrapingLimit ? postList.length : scrapingLimit
      }`,
    )

    this.successCount = 0

    posts.forEach(async (post) => {
      const isDuplicated = await prisma.post.findFirst({
        where: {
          refUrl: post.referencePostUrl,
        },
      })

      if (isDuplicated) {
        logError(
          `[ ${name} ] Post already exists! reference: ${isDuplicated.refUrl}`,
        )
        console.log(
          `[ ${name} ] Added ${this.successCount} of ${
            postList.length <= scrapingLimit ? postList.length : scrapingLimit
          } posts to database`,
        )
      } else {
        await prisma.post.create({
          data: {
            refTitle: post.title,
            refContent: wordsToRemove
              ? removeFromText(post.content, wordsToRemove)
              : post.content,
            refUrl: post.referencePostUrl,
            refImage: post.img,
            blogId,
            competitorId: id,
          },
        })

        this.successCount++

        console.log(
          `[ ${name} ] Added ${this.successCount} of ${
            postList.length <= scrapingLimit ? postList.length : scrapingLimit
          } posts to database`,
        )
      }
    })
  }
}
