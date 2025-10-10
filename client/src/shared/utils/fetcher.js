export async function fetcher(url, options = {}) {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`Błąd: ${res.status}`)
  return res.json()
}
