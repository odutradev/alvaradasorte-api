export const filterObject = <T extends Record<string, unknown>>(obj: T, keysToExclude: string[]): Partial<T> => {
  return Object.keys(obj)
    .filter((key) => !keysToExclude.includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as Partial<T>)
}