/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - HTTP API CLIENT
 * ============================================================================
 * Connects with the Spring Boot Java Backend:
 * - Base URL configured via VITE_API_URL or defaults to localhost:8080
 * - Intercepts Bearer tokens for authenticated Barber & Admin requests
 * - Parsed on Spring Boot backend by:
 *   com.glowslot.security.FirebaseAuthenticationFilter.java
 *   com.glowslot.security.FirebaseAuthenticationToken.java
 * ============================================================================
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  public setAuthToken(token: string | null) {
    this.token = token;
  }

  public getAuthToken(): string | null {
    return this.token;
  }

  /**
   * Generic request wrapper with Spring Boot header interceptors & JSON handling
   */
  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // If barber or staff is authenticated, inject Authorization Bearer token
    // Handled by Spring Boot: FirebaseAuthenticationFilter
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorMessage;
        } catch {
          // Response body was not JSON
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.warn(`[Spring Boot API Connection] Error on ${endpoint}:`, error);
      throw error;
    }
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
