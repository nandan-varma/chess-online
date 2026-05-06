/**
 * Event handler and callback types
 */

/**
 * Generic async callback with result
 */
export type AsyncCallback<T> = (data: T) => Promise<void>

/**
 * Generic callback for data
 */
export type DataCallback<T> = (data: T) => void

/**
 * Generic callback without arguments
 */
export type VoidCallback = () => void

/**
 * Firebase database snapshot handler
 */
export interface DatabaseSnapshot<T> {
  exists: () => boolean
  val: () => T | null
  key: string | null
}

/**
 * Query result type
 */
export interface QueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Mutation result type
 */
export interface MutationResult<T, E = Error> {
  data: T | null
  loading: boolean
  error: E | null
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
}

/**
 * Async state discriminator
 */
export type AsyncState<T> =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; data: T }
  | { state: 'error'; error: Error }

/**
 * React event handlers with proper typing
 */
export type FormEventHandler = (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>

export type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void

export type TextAreaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => void

export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void | Promise<void>

export type KeyboardHandler = (event: React.KeyboardEvent<HTMLElement>) => void

/**
 * Props type helper
 */
export type PropsOf<T extends React.ElementType> = React.ComponentProps<T>
