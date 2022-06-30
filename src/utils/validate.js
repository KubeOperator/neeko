export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isJson(str) {
  try {
    if (typeof JSON.parse(str) === "object") {
      return true
    }
  } catch {
    return false
  }
}