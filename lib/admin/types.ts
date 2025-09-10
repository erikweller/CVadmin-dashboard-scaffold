export interface DashboardStats {
  activeUsers: number
  connectedCalendars: number
  meetings30d: number
  totalRevenue: number
  activeCVCs: number
  pendingPayouts: number
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
  lastSignIn?: string
  role?: string
  active: boolean
}

export interface CVC {
  id: string
  userId: string
  email: string
  name: string
  specialties: string[]
  status: "pending" | "approved" | "rejected" | "suspended"
  applicationDate: string
  approvalDate?: string
  rating?: number
  totalSessions: number
  totalEarnings: number
}

export interface Meeting {
  id: string
  cvcId: string
  clientId: string
  title: string
  scheduledAt: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  type: "individual" | "group"
  revenue: number
}

export interface AdminAuditLog {
  id: string
  actorEmail: string
  action: string
  target: string
  createdAt: string
  details?: Record<string, any>
}
