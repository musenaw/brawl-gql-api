export const tagTransform = (tag: string) => {
  tag = tag[0] === '#' ? tag : `#${tag}`
  return encodeURIComponent(tag)
}
