import { toast } from 'react-toastify'

interface RequestOptions {
  method: string
  headers?: Record<string, string>
  body?: any
}

interface ToastOptions {
  isShow?: boolean
  successMessage?: string
  errorMessage?: string
}

export async function get<T>(url: string, toastOptions: ToastOptions = { isShow: false }): Promise<T | undefined> {
  return await api<T>(url, { method: 'GET' }, toastOptions)
}

export async function post<T>(
  url: string,
  body: any,
  toastOptions: ToastOptions = {
    isShow: true,
    successMessage: '完了しました',
    errorMessage: 'エラーが発生しました',
  },
): Promise<T | undefined> {
  return await api<T>(url, { method: 'POST', body }, toastOptions)
}

export async function put<T>(
  url: string,
  body: any,
  toastOptions: ToastOptions = {
    isShow: true,
    successMessage: '完了しました',
    errorMessage: 'エラーが発生しました',
  },
): Promise<T | undefined> {
  return await api<T>(url, { method: 'PUT', body }, toastOptions)
}

export async function remove<T>(
  url: string,
  toastOptions: ToastOptions = {
    isShow: true,
    successMessage: '削除しました',
    errorMessage: 'エラーが発生しました',
  },
): Promise<T | undefined> {
  return await api<T>(url, { method: 'DELETE' }, toastOptions)
}

export async function api<T>(url: string, options: RequestOptions = { method: 'GET' }, toastOptions?: ToastOptions): Promise<T | undefined> {
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
    if (toastOptions?.isShow) {
      toast.success(toastOptions.successMessage)
    }

    return responseData
  } catch (error) {
    if (toastOptions?.isShow) {
      toast.error(toastOptions.errorMessage)
    }
    console.error(error)
  }
}
