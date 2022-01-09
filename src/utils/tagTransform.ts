export const tagTransform = (tag: string) => {
  tag = tag[0] === '#' ? tag.replace('#', '%23') : `%23${tag}`
  return tag
}
