import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Task, ToolNote } from "../types/types"
import { parseCSV, parseNotesCSV, tasksToCSV, notesToCSV, getAzureBlobUrl } from "../lib/csvUtils"

export const useCalendarData = () => {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [toolNotes, setToolNotes] = useState<ToolNote[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const AZURE_BLOB_URL = getAzureBlobUrl(import.meta.env.VITE_AZURE_CALENDAR_BLOB_NAME || "calendar-tasks.csv")
  const AZURE_NOTES_URL = getAzureBlobUrl("tool-notes.csv")

  const loadTasksFromAzure = async () => {
    try {
      console.log("Attempting to load tasks from:", AZURE_BLOB_URL.split('?')[0])
      
      const response = await fetch(AZURE_BLOB_URL, {
        method: 'GET',
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      })
      
      if (response.status === 404) {
        console.log("CSV file doesn't exist yet - will be created on first save")
        setTasks([])
        return
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load tasks: ${response.status} ${response.statusText}`)
      }
      
      const csvText = await response.text()
      const parsedTasks = parseCSV(csvText)
      setTasks(parsedTasks)
      
      toast({
        title: "Success",
        description: `Loaded ${parsedTasks.length} tasks from Azure`,
      })
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast({
        title: "Error",
        description: "Failed to load tasks from Azure.",
        variant: "destructive",
      })
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const loadNotesFromAzure = async () => {
    try {
      const response = await fetch(AZURE_NOTES_URL, {
        method: 'GET',
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      })
      
      if (response.status === 404) {
        setToolNotes([])
        return
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load notes: ${response.status}`)
      }
      
      const csvText = await response.text()
      const parsedNotes = parseNotesCSV(csvText)
      setToolNotes(parsedNotes)
    } catch (error) {
      console.error("Error loading notes:", error)
      setToolNotes([])
    }
  }

  const saveTasksToAzure = async (updatedTasks: Task[]) => {
    setSyncing(true)
    try {
      const csvContent = tasksToCSV(updatedTasks)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      
      const response = await fetch(AZURE_BLOB_URL, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'text/csv'
        },
        body: blob
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save tasks: ${response.statusText}`)
      }
      
      toast({
        title: "Success",
        description: "Tasks synced to Azure Blob Storage",
      })
    } catch (error) {
      console.error("Error saving tasks:", error)
      toast({
        title: "Error",
        description: "Failed to sync tasks to Azure.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const saveNotesToAzure = async (updatedNotes: ToolNote[]) => {
    try {
      const csvContent = notesToCSV(updatedNotes)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      
      const response = await fetch(AZURE_NOTES_URL, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'text/csv'
        },
        body: blob
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save notes: ${response.statusText}`)
      }
      
      toast({
        title: "Success",
        description: "Notes synced to Azure Blob Storage",
      })
    } catch (error) {
      console.error("Error saving notes:", error)
      toast({
        title: "Error",
        description: "Failed to sync notes to Azure.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadCSV = () => {
    const csvContent = tasksToCSV(tasks)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleUploadCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const csvText = e.target?.result as string
        const parsedTasks = parseCSV(csvText)
        setTasks(parsedTasks)
        await saveTasksToAzure(parsedTasks)
        
        toast({
          title: "Success",
          description: `Imported ${parsedTasks.length} tasks`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import CSV file",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return {
    tasks,
    toolNotes,
    loading,
    syncing,
    setTasks,
    setToolNotes,
    loadTasksFromAzure,
    loadNotesFromAzure,
    saveTasksToAzure,
    saveNotesToAzure,
    handleDownloadCSV,
    handleUploadCSV,
  }
}