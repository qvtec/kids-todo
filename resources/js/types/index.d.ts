export interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User
  }
}

export interface Option {
  id: number
  label: string
}

export interface Subject {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface StudyTest {
  id: number
  subject_id: number
  name: string
  countdown: number
  total: number
  created_at: string
  updated_at: string
}

export interface Question {
  id: number
  study_test_id: number
  content: string
  answer: string
  ng_count: number
  ok_count: number
  created_at: string
  updated_at: string
}

export interface Answer {
  id: number
  study_test_id: number
  score: number
  time: string
  result_contens: object
  is_complete: boolean
  created_at: string
  updated_at: string
}
