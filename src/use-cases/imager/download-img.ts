import axios from 'axios'
import fs from 'fs'

export async function downloadImage(url: string, filename: string) {
  const reply = axios.get(url, {
    responseType: 'arraybuffer',
  })

  const image = fs.writeFile(`./img/${filename}`, (await reply).data, (err) => {
    if (err) throw err
    console.log('Image downloaded successfully!')
    return `./img/${filename}`
  })

  return image
}
