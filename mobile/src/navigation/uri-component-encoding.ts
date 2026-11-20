// encodeURIComponent throws URIError on a lone surrogate (e.g. a name cut mid-emoji); Hermes lacks String.prototype.toWellFormed.
export function toWellFormedText(value: string): string {
  let out = ''
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(i + 1)
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += value[i] + value[i + 1]
        i++
        continue
      }
      out += '�'
    } else {
      out += code >= 0xdc00 && code <= 0xdfff ? '�' : value[i]
    }
  }
  return out
}

export function encodeUriComponentSafe(value: string): string {
  return encodeURIComponent(toWellFormedText(value))
}
