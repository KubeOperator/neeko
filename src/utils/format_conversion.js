export function changeUnderLineToPoint(obj) {
  for (var item in obj) {
    var newParam = item.replaceAll("__", "-").replaceAll("_", ".")
    obj[newParam] = obj[item]
    delete obj[item]
  }
  return obj
}

export function changePointToUnderLine(obj) {
  for (var item in obj) {
    var newParam = item.replaceAll("-", "__").replaceAll(".", "_")
    obj[newParam] = obj[item]
    delete obj[item]
  }
  return obj
}