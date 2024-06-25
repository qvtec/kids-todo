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

// ---------------------------------------
// date
// ---------------------------------------

export function formatToday() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function shortDate(value: string = '') {
  const date = value ? new Date(value) : new Date()
  const month = String(date.getMonth() + 1)
  const day = String(date.getDate())
  return `${month}/${day}`
}

export function formatDateYmd(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function dateWeek(value: string = '') {
  const date = value ? new Date(value) : new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1)
  const day = String(date.getDate())
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']
  const dayOfWeek = daysOfWeek[date.getDay()]
  return `${year}年${month}月${day}日 (${dayOfWeek})`
}
