import type { FilterConfig } from '@core/factories/filters/types'

export const parseFilters = (filtersString?: string, config?: FilterConfig): Record<string, string> => {
  if (!filtersString) return {}
  if (!config) return {}

  const parts = filtersString.split(',')
  const allowedPartial = config.partial ?? []
  const allowedExact = config.exact ?? []

  const entries = parts.reduce<string[][]>((acc, part, index) => {
    const isKeyIndex = index % 2 === 0
    const nextPart = parts[index + 1]

    if (isKeyIndex && nextPart !== undefined) return [...acc, [part, nextPart]]

    return acc
  }, [])

  return entries.reduce<Record<string, string>>((acc, [key, value]) => {
    if (allowedExact.includes(key)) return { ...acc, [key]: value }
    if (allowedPartial.includes(key)) return { ...acc, [key]: value }

    return acc
  }, {})
}

export const applyInMemoryFilters = <T extends Record<string, unknown>>(data: T[], filters: Record<string, string>, config: FilterConfig): T[] => {
  if (Object.keys(filters).length === 0) return data

  return data.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      const itemValue = String(item[key] ?? '').toLowerCase()
      const filterValue = String(value).toLowerCase()

      if (config.exact?.includes(key)) return itemValue === filterValue
      if (config.partial?.includes(key)) return itemValue.includes(filterValue)

      return true
    })
  })
}