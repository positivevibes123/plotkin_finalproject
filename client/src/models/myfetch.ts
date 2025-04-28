export const API_ROOT = import.meta.env.VITE_API_ROOT as string ?? 'http://localhost:8000/api/v1/'

import { refSession } from '../models/session'

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

/**
 * Custom error class for authentication errors
 */
export class AuthError extends APIError {
  constructor(message: string) {
    super(message, 401)
    this.name = 'AuthError'
  }
}

interface ErrorResponse {
  message: string
  isSuccess: false
}

/**
 * Makes a REST request to the specified URL
 * @param url The URL to make the request to
 * @param data Optional data to send with the request
 * @param method Optional HTTP method to use
 * @returns Promise containing the response data
 * @throws APIError if the request fails
 * @throws AuthError if authentication fails
 */
export async function rest<T>(url: string, data?: any, method?: string): Promise<T> {
  const session = refSession()
  
  try {
    const params : RequestInit = {
      method: method ?? (data ? 'POST' : 'GET'),
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.value.token ? `Bearer ${session.value.token}` : ''
      }
    }
    
    if (method === 'POST' || method === 'PUT') {
      params.body = data ? JSON.stringify(data) : undefined
    }
    
    const response = await fetch(url, params)

    if (!response.ok) {
      let errorMessage: string
      try {
        const errorData = await response.json() as ErrorResponse
        errorMessage = errorData.message
      } catch {
        errorMessage = `Request failed with status ${response.status}`
      }

      if (response.status === 401) {
        localStorage.removeItem('session')
        window.location.href = '/login'
        throw new AuthError(errorMessage)
      }

      throw new APIError(errorMessage, response.status)
    }

    const responseData = await response.json()

    if (responseData && !responseData.isSuccess) {
      throw new APIError(responseData.message || 'Operation failed', response.status)
    }

    return responseData as T
  } catch (error) {
    if (error instanceof APIError || error instanceof AuthError) {
      throw error
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    )
  }
}

/**
 * Makes a request to the API using the configured base URL
 * @param url The endpoint path
 * @param data Optional data to send with the request
 * @param method Optional HTTP method to use
 * @returns Promise containing the response data
 * @throws APIError if the request fails
 * @throws AuthError if authentication fails
 */
export function api<T>(url: string, data?: any, method?: string): Promise<T> {
  console.log('API URL:', API_ROOT + url)
  return rest<T>(API_ROOT + url, data, method)
}