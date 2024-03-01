import { format } from 'date-fns'

/**
 * now
 */
export function now(pattern = 'yyyy-MM-dd HH:mm:ss') {
  const date = new Date()
  return format(date, pattern)
}

/**
 * formatDate
 */
export function formatDate(value: string, pattern = 'yyyy-MM-dd') {
  const date = new Date(value)
  return format(date, pattern)
}

/**
 * formatDateTime
 */
export function formatDateTime(value: string, pattern = 'yyyy-MM-dd HH:mm:ss') {
  return formatDate(value, pattern)
}
