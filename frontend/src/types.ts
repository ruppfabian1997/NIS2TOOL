export type QuestionType = 'scale' | 'boolean'

export interface Question {
  id: string
  text: string
  type: QuestionType
}

export interface Measure {
  id: string
  title: string
  priority: string
}

export interface Domain {
  id: string
  title: string
  questions: Question[]
  measures: Measure[]
}

export interface Task {
  id: number
  domain_id: string
  measure_id: string
  title: string
  priority: string
  status: string
}

export interface DomainScore {
  domain_id: string
  score_percent: number
}
