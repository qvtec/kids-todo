import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

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

/**
 * formatDateTime
 */
export function DateWeek() {
  const now = new Date()
  return format(now, 'yyyy年M月d日 (E)', { locale: ja })
}

/**
 * isMorning
 */
export const isMorning = currentHour() >= 0 && currentHour() < 12
export function currentHour() {
  const now = new Date()
  return now.getHours()
}
