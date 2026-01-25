// API Configuration for EcoCash
// Automatically uses environment variable in production or localhost in development

const getApiBaseUrl = (): string => {
  // Check for environment variable first (production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development fallback - use proxy in dev mode
  if (import.meta.env.DEV) {
    return '/api'; // Use Vite proxy to avoid CORS and HTTPS issues
  }
  
  // Production fallback - try to detect Railway backend
  // If frontend is at xxx.up.railway.app, backend might be at similar domain
  if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
    console.warn('VITE_API_URL not set! Please set it in Railway environment variables.');
  }
  
  // Fallback - try proxy first, then direct URL
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return '/api';
  }
  return 'http://127.0.0.1:8000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper to get CSRF token from cookies
function getCsrfToken(): string | null {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Helper function for API calls with timeout
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = 15000 // 15 seconds for production
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get CSRF token for POST/PUT/DELETE requests
  const csrfToken = getCsrfToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  // Add CSRF token if available and method is not GET/HEAD
  if (csrfToken && options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const defaultOptions: RequestInit = {
    headers,
    credentials: 'include', // Important for session cookies
    mode: 'cors', // Explicitly set CORS mode
    ...options,
  };

  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - Serverga ulanishda muammo')), timeout);
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(url, defaultOptions),
      timeoutPromise
    ]);
    
    if (!response.ok) {
      let errorMessage = 'Network error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error: any) {
    // Better error handling for network errors
    if (error.message.includes('timeout')) {
      throw error;
    }
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      // Backend serverga ulanishda muammo
      console.error('Backend serverga ulanishda muammo:', error);
      console.error('API URL:', API_BASE_URL);
      
      if (import.meta.env.PROD) {
        throw new Error('Serverga ulanishda muammo. Iltimos, keyinroq urinib ko\'ring.');
      }
      
      throw new Error('Backend serverga ulanishda muammo. Iltimos, backend serverni ishga tushiring:\n\ncd backend\npython manage.py runserver\n\nYoki backend serverni tekshiring: http://127.0.0.1:8000/api/');
    }
    throw error;
  }
}

// Debug info (only in development)
if (import.meta.env.DEV) {
  console.log('[API Config] Base URL:', API_BASE_URL);
}
