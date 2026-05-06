/**
 * HTTP Client configuration and utilities
 * Centralized HTTP request handling with error management
 */

import { errorService } from '@/services/errorService'

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

export interface HttpResponse<T> {
  data: T
  status: number
  headers: Headers
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
      const response = await fetch(url, {
        method: config.method || 'GET',
        headers: { ...this.defaultHeaders, ...config.headers },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        data: data as T,
        status: response.status,
        headers: response.headers,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      errorService.handleError(error, { endpoint, config })
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'GET' })
    return response.data
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
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
    body?: unknown,
    config?: RequestConfig
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
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'DELETE' })
    return response.data
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
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
