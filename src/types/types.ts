export interface Task {
  id: string
  toolId: string
  toolName: string
  note: string
  date: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

export interface ToolNote {
  id: string
  toolId: string
  toolName: string
  content: string
  createdAt: string
  updatedAt: string
}