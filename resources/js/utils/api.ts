interface RequestOptions {
  method: string
  headers?: Record<string, string>
  body?: any
}

export async function get<T>(url: string): Promise<T | undefined> {
  return await api<T>(url, { method: 'GET' })
}

export async function post<T>(
  url: string,
  body: any,
): Promise<T | undefined> {
  return await api<T>(url, { method: 'POST', body })
}

export async function put<T>(
  url: string,
  body: any,
): Promise<T | undefined> {
  return await api<T>(url, { method: 'PUT', body })
}

export async function remove<T>(
  url: string,
): Promise<T | undefined> {
  return await api<T>(url, { method: 'DELETE' })
}

export async function api<T>(url: string, options: RequestOptions = { method: 'GET' }): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const responseData: T = await response.json()
    return responseData
  } catch (error) {
    console.error(error)
  }
}
