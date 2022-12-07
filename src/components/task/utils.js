export const cahgeText = (text) =>
  text.length > 200
    ? (text = text.split(' ').slice(0, 26).join(' ') + '...')
    : text
