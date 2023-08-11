import { runScrapper } from '../use-cases/scrapper/run-scrapper'
import { runRewriter } from '../use-cases/rewriter/run-rewriter'
import { runImager } from '../use-cases/imager/run-imager'
import { runScheduler } from '../use-cases/scheduler/run-scheduler'
import { logError } from '../utils/log-error'

const SAGE = [runScrapper, runRewriter, runImager, runScheduler]

for (const [index, runService] of SAGE.entries()) {
  try {
    setTimeout(async () => {
      console.log(`\n@ SAGE Queue: ${index + 1} of ${SAGE.length} @`)
      await runService()
    }, index * 60000)
  } catch (error: any) {
    logError(`@@@ run-sage ERROR @@@\n${error}`)
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }
  }
}
