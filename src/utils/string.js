export function string(text, limit = 20) {
  if (!text) return ''

  if (text.length > limit) {
    return text.substring(0, limit) + '...'
  }

  return text
}
