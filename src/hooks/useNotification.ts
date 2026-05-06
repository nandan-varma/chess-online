/**
 * Notification hook - Wrapper around Sonner toast for consistent notifications
 */

import { toast as sonnerToast } from 'sonner'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationOptions {
  duration?: number
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Use notification hook
 */
export const useNotification = () => {
  const showNotification = (
    message: string,
    type: NotificationType = 'info',
    options: NotificationOptions = {}
  ) => {
    const baseOptions = {
      duration: options.duration || 4000,
      description: options.description,
      action: options.action,
    }

    switch (type) {
      case 'success':
        return sonnerToast.success(message, baseOptions)
      case 'error':
        return sonnerToast.error(message, baseOptions)
      case 'warning':
        return sonnerToast.warning(message, baseOptions)
      case 'info':
      default:
        return sonnerToast.message(message, baseOptions)
    }
  }

  return {
    success: (message: string, options?: NotificationOptions) =>
      showNotification(message, 'success', options),
    error: (message: string, options?: NotificationOptions) =>
      showNotification(message, 'error', options),
    warning: (message: string, options?: NotificationOptions) =>
      showNotification(message, 'warning', options),
    info: (message: string, options?: NotificationOptions) =>
      showNotification(message, 'info', options),
  }
}
