export function getActiveTabUrl() {
  return browser.tabs.query({ active: true, currentWindow: true }).then(tabs => tabs[0].url)
}

/**
 * Get value from map; if not exists, create it with factory and return it.
 */
export function ensureKeyInMap<K, V>(map: Map<K, V>, key: K, factory: () => V): V {
  let val = map.get(key)
  if (val === undefined) {
    val = factory()
    map.set(key, val)
  }
  return val
}
