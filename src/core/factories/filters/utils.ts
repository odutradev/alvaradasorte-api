import { Op } from 'sequelize'

import type { FilterConfig } from '@core/factories/filters/types'
import type { WhereOptions } from 'sequelize'

export const parseFilters = (filtersString?: string, config?: FilterConfig): WhereOptions => {
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

  return entries.reduce<WhereOptions>((acc, [key, value]) => {
    if (allowedExact.includes(key)) return { ...acc, [key]: value }
    if (allowedPartial.includes(key)) return { ...acc, [key]: { [Op.iLike]: `%${value}%` } }

    return acc
  }, {})
}