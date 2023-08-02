export function clearHTMLTags(string: string) {
  const htmlTags = [
    '<h1>',
    '</h1>',
    '<h2>',
    '</h2>',
    '<p>',
    '</p>',
    '<ul>',
    '</ul>',
    '<li>',
    '</li>',
  ]

  htmlTags.forEach((tag) => {
    string = string.replace(tag, '')
  })

  return string
}
