/**
 * Data structure and API types
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message?: string
  timestamp: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * Optional fields helper
 */
export type Optional<T> = T | null | undefined

/**
 * Readonly record
 */
export type ReadonlyRecord<K extends string | number | symbol, V> = Readonly<Record<K, V>>

/**
 * Deep partial
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Exclude null and undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T

/**
 * Extract promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T

/**
 * Function type
 */
export type Func<Args extends readonly any[] = readonly [], R = void> = (
  ...args: Args
) => R

/**
 * Async function type
 */
export type AsyncFunc<Args extends readonly any[] = readonly [], R = void> = (
  ...args: Args
) => Promise<R>

/**
 * Constructor type
 */
export type Constructor<T = {}> = new (...args: any[]) => T

/**
 * Class type
 */
export type Class<T = {}> = Constructor<T> & {
  prototype: T
}
