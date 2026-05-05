/**
 * Theme management utilities
 * Handles dark/light mode without next-themes dependency
 */

type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'chess-online-theme'

/**
 * Get the current system theme preference
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Get the effective theme (resolving 'system' to actual theme)
 */
const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

/**
 * Apply theme to document
 */
const applyTheme = (theme: Theme): void => {
  if (typeof document === 'undefined') return

  const effectiveTheme = getEffectiveTheme(theme)
  const htmlElement = document.documentElement

  if (effectiveTheme === 'dark') {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
}

/**
 * Get saved theme preference from localStorage
 */
const getSavedTheme = (): Theme | null => {
  if (typeof localStorage === 'undefined') return null
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  return (saved as Theme) || null
}

/**
 * Save theme preference to localStorage
 */
const saveTheme = (theme: Theme): void => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * Initialize theme on app load
 */
const initializeTheme = (): Theme => {
  const saved = getSavedTheme()
  const theme = saved || 'system'
  applyTheme(theme)
  return theme
}

/**
 * Set and persist theme
 */
const setTheme = (theme: Theme): void => {
  saveTheme(theme)
  applyTheme(theme)

  // Dispatch custom event for components to listen
  window.dispatchEvent(
    new CustomEvent('theme-change', { detail: { theme } })
  )
}

export {
  applyTheme,
  getEffectiveTheme,
  getSystemTheme,
  getSavedTheme,
  initializeTheme,
  saveTheme,
  setTheme,
  type Theme,
}
