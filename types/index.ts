export type CheckIn = {
    id: string
    user_id: string
    created_at: string
    finished_yesterday: string
    focus_today: string
    blockers: string | null
  }
  
  export type Profile = {
    id: string
    email: string
    reminder_time: string | null
    is_pro: boolean
    created_at: string
  }
  
  export type WeekSummary = {
    weekOf: string
    entries: CheckIn[]
    streakCount: number
    totalCheckins: number
  }
  