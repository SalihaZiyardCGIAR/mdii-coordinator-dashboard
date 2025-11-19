import { Task, ToolNote } from "../types/types"

const AZURE_STORAGE_ACCOUNT = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || "mdiipanels"

export const getAzureBlobUrl = (blobName: string) => {
  const sasToken = import.meta.env.VITE_AZURE_CALENDAR_SAS_TOKEN
  if (!sasToken) {
    console.error("No SAS token found in environment variables")
  }
  return `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${import.meta.env.VITE_AZURE_CALENDAR_CONTAINER}/${blobName}?${sasToken}`
}

export const parseCSV = (csvText: string): Task[] => {
  const lines = csvText.trim().split('\n')
  if (lines.length <= 1) return []
  
  const headers = lines[0].split(',')
  const tasks: Task[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length >= headers.length) {
      tasks.push({
        id: values[0],
        toolId: values[1],
        toolName: values[2],
        note: values[3],
        date: values[4],
        completed: values[5] === 'true',
        createdAt: values[6],
        completedAt: values[7] || undefined,
        priority: (values[8] as any) || "medium"
      })
    }
  }
  
  return tasks
}

export const parseNotesCSV = (csvText: string): ToolNote[] => {
  const lines = csvText.trim().split('\n')
  if (lines.length <= 1) return []
  
  const notes: ToolNote[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length >= 5) {
      notes.push({
        id: values[0],
        toolId: values[1],
        toolName: values[2],
        content: values[3],
        createdAt: values[4],
        updatedAt: values[5] || values[4]
      })
    }
  }
  
  return notes
}

export const tasksToCSV = (tasks: Task[]): string => {
  const headers = ['id', 'toolId', 'toolName', 'note', 'date', 'completed', 'createdAt', 'completedAt', 'priority']
  const rows = tasks.map(task => [
    task.id,
    task.toolId,
    task.toolName,
    task.note,
    task.date,
    task.completed,
    task.createdAt,
    task.completedAt || '',
    task.priority || 'medium'
  ])
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

export const notesToCSV = (notes: ToolNote[]): string => {
  const headers = ['id', 'toolId', 'toolName', 'content', 'createdAt', 'updatedAt']
  const rows = notes.map(note => [
    note.id,
    note.toolId,
    note.toolName,
    note.content,
    note.createdAt,
    note.updatedAt
  ])
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}