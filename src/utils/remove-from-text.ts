export function removeFromText(content: string, wordsArray: Array<string>) {
  if (!wordsArray) {
    return content
  }

  let cleanContent = content

  wordsArray.forEach((word) => {
    cleanContent = cleanContent.replace(new RegExp(word, 'g'), '')
  })

  return cleanContent
}
