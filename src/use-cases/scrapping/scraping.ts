import puppeteer from 'puppeteer'

// Infos necessárias para o scrapping
const cardListUrl = 'https://guiadaeconomia.com.br/category/financas-pessoais/'
const postCardEl = '.card-content > h2 > a'
const postTitleEl = 'h1'
const postContentEl = 'article > div'

async function scrapper() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  console.log('Browser launched...')

  await page.goto(cardListUrl)
  console.log(`Navigated to ${cardListUrl}`)

  await page.setViewport({ width: 1366, height: 900 })
  console.log('Viewport set to 1366x900...')

  const postList = await page.evaluate((postCardEl) => {
    const nodeList = document.querySelectorAll(postCardEl)

    const elementArray = [...nodeList]

    const postList = elementArray.map((element: any) => ({
      url: element.href,
    }))

    return postList
  }, postCardEl)

  console.log('Posts urls collected...')

  const posts = []

  for (const post of postList) {
    await page.goto(post.url)
    console.log(`Navigated to ${post.url}`)
    const postData = await page.evaluate(
      (postTitleEl, postContentEl) => {
        return {
          title: document.querySelector(postTitleEl)?.innerHTML,
          content: document.querySelector(postContentEl)?.innerHTML,
          referencePostUrl: window.location.href,
        }
      },
      postTitleEl,
      postContentEl,
    )

    console.log('Got data!')
    posts.push(postData)
  }

  console.log('Posts data fetched!')

  await browser.close()

  console.log('Scraping done with success!')
}

scrapper()
