/**
 * HTTP Client configuration and utilities
 * Centralized HTTP request handling with error management
 */

import { errorService } from '@/services/errorService'

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: Record<string, unknown> | FormData
  timeout?: number
}

export interface HttpResponse<T> {
  data: T
  status: number
  headers: Headers
}

/**
 * Type guard for JSON-serializable data
 */
const isJsonSerializable = (data: unknown): data is Record<string, unknown> | null => {
  return (
    typeof data === 'object' &&
    (data === null || Array.isArray(data) || !(data instanceof FormData))
  )
}

class HttpClient {
  private baseURL: string = ''
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  private timeout: number = 30000 // 30 seconds

  /**
   * Set base URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  /**
   * Set timeout
   */
  setTimeout(ms: number): void {
    this.timeout = ms
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<HttpResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const fetchConfig: RequestInit = {
        method: config.method || 'GET',
        headers: { ...this.defaultHeaders, ...config.headers },
        signal: controller.signal,
      }

      // Handle body serialization
      if (config.body) {
        if (config.body instanceof FormData) {
          fetchConfig.body = config.body
          // Remove Content-Type for FormData (browser will set it automatically)
          if (fetchConfig.headers && typeof fetchConfig.headers === 'object' && 'Content-Type' in fetchConfig.headers) {
            const headers = fetchConfig.headers as Record<string, string>
            delete headers['Content-Type']
          }
        } else if (isJsonSerializable(config.body)) {
          fetchConfig.body = JSON.stringify(config.body)
        }
      }

      const response = await fetch(url, fetchConfig)

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
        const context: Record<string, string | number | boolean> = { endpoint }
        if (config.method) {
          context.method = config.method
        }
        errorService.handleError(error, context)
        throw error
      }

      const data = (await response.json()) as T

      return {
        data,
        status: response.status,
        headers: response.headers,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      const context: Record<string, string | number | boolean> = { endpoint }
      if (config.method) {
        context.method = config.method
      }
      const err = error instanceof Error ? error : new Error(String(error))
      errorService.handleError(err, context)
      throw err
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'body'>): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'GET' })
    return response.data
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body,
    })
    return response.data
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body,
    })
    return response.data
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'body'>): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'DELETE' })
    return response.data
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    config?: Omit<RequestConfig, 'body'>
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body,
    })
    return response.data
  }
}

export const httpClient = new HttpClient()
