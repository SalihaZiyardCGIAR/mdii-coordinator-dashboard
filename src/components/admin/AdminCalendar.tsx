"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, Plus, Check, Trash2, Search, Calendar as CalendarIcon, Upload, Download, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useData } from "@/context/DataContext"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  toolId: string
  toolName: string
  note: string
  date: string
  completed: boolean
  createdAt: string
  completedAt?: string
  priority?: "low" | "medium" | "high"
}

interface ToolNote {
  id: string
  toolId: string
  toolName: string
  content: string
  createdAt: string
  updatedAt: string
}

// Azure Blob Storage configuration - using environment variables
const AZURE_STORAGE_ACCOUNT = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || "mdiipanels"

// Get SAS token from environment or fallback
const getAzureBlobUrl = (blobName: string) => {
  const sasToken = import.meta.env.VITE_AZURE_CALENDAR_SAS_TOKEN
  if (!sasToken) {
    console.error("No SAS token found in environment variables")
  }
  return `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${import.meta.env.VITE_AZURE_CALENDAR_CONTAINER}/${blobName}?${sasToken}`
}

const AZURE_BLOB_URL = getAzureBlobUrl(import.meta.env.VITE_AZURE_CALENDAR_BLOB_NAME)
const AZURE_NOTES_URL = getAzureBlobUrl(import.meta.env.VITE_AZURE_TOOL_NOTES_BLOB_NAME)

export  function AdminCalendar() {
  const { tools } = useData()
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [toolNotes, setToolNotes] = useState<ToolNote[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedToolId, setSelectedToolId] = useState("")
  const [taskNote, setTaskNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [toolSearchQuery, setToolSearchQuery] = useState("")
  const [showToolDropdown, setShowToolDropdown] = useState(false)
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "createdAt" | "priority">("date")
  const [filterBy, setFilterBy] = useState<"all" | "active" | "completed">("all")
  const [toolFilter, setToolFilter] = useState<string>("")
  const [syncing, setSyncing] = useState(false)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [confirmCompleteTaskId, setConfirmCompleteTaskId] = useState<string | null>(null)
  
  // Notes panel state
  const [selectedToolForNotes, setSelectedToolForNotes] = useState<string | null>(null)
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [deleteConfirmNoteId, setDeleteConfirmNoteId] = useState<string | null>(null)

  // Parse CSV data
  const parseCSV = (csvText: string): Task[] => {
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

  // Parse notes CSV
  const parseNotesCSV = (csvText: string): ToolNote[] => {
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

  // Convert tasks to CSV
  const tasksToCSV = (tasks: Task[]): string => {
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

  // Convert notes to CSV
  const notesToCSV = (notes: ToolNote[]): string => {
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

  // Load tasks from Azure Blob Storage
  const loadTasksFromAzure = async () => {
    try {
      console.log("Attempting to load tasks from:", AZURE_BLOB_URL.split('?')[0])
      
      const response = await fetch(AZURE_BLOB_URL, {
        method: 'GET',
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      })
      
      console.log("Response status:", response.status)
      
      if (response.status === 404) {
        console.log("CSV file doesn't exist yet - will be created on first save")
        setTasks([])
        return
      }
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Azure response error:", errorText)
        throw new Error(`Failed to load tasks: ${response.status} ${response.statusText}`)
      }
      
      const csvText = await response.text()
      console.log("CSV loaded, length:", csvText.length)
      
      const parsedTasks = parseCSV(csvText)
      console.log("Parsed tasks:", parsedTasks.length)
      setTasks(parsedTasks)
      
      toast({
        title: "Success",
        description: `Loaded ${parsedTasks.length} tasks from Azure`,
      })
    } catch (error) {
      console.error("Error loading tasks:", error)
      
      toast({
        title: "Error",
        description: "Failed to load tasks from Azure. Please check your configuration.",
        variant: "destructive",
      })
      
      setTasks([])
    }
  }

  // Load notes from Azure Blob Storage
  const loadNotesFromAzure = async () => {
    try {
      console.log("Attempting to load notes from:", AZURE_NOTES_URL.split('?')[0])
      
      const response = await fetch(AZURE_NOTES_URL, {
        method: 'GET',
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      })
      
      if (response.status === 404) {
        console.log("Notes CSV doesn't exist yet - will be created on first save")
        setToolNotes([])
        return
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load notes: ${response.status} ${response.statusText}`)
      }
      
      const csvText = await response.text()
      const parsedNotes = parseNotesCSV(csvText)
      setToolNotes(parsedNotes)
      
      console.log("Loaded notes:", parsedNotes.length)
    } catch (error) {
      console.error("Error loading notes:", error)
      setToolNotes([])
    }
  }

  // Save tasks to Azure Blob Storage
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
        description: "Failed to sync tasks to Azure. Changes saved locally.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  // Save notes to Azure Blob Storage
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

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([loadTasksFromAzure(), loadNotesFromAzure()])
      setLoading(false)
    }
    loadData()
  }, [])

  // Add new task
  const handleSaveTask = async () => {
    if (!selectedToolId || !taskNote.trim() || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a tool and enter a note.",
        variant: "destructive",
      })
      return
    }

    const tool = tools.find((t) => t.id === selectedToolId)
    if (!tool) return

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      toolId: selectedToolId,
      toolName: tool.name,
      note: taskNote,
      date: selectedDate.toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "medium",
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    await saveTasksToAzure(updatedTasks)
    
    setSelectedToolId("")
    setTaskNote("")
    setToolSearchQuery("")
    setIsAddDialogOpen(false)
  }

  // Toggle task completion
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    if (!task.completed) {
      setConfirmCompleteTaskId(taskId)
      return
    }
    
    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            completed: false,
            completedAt: undefined
          }
        : t
    )
    setTasks(updatedTasks)
    await saveTasksToAzure(updatedTasks)
  }
  
  // Confirm task completion
  const confirmTaskCompletion = async () => {
    if (!confirmCompleteTaskId) return
    
    const updatedTasks = tasks.map(task => 
      task.id === confirmCompleteTaskId 
        ? { 
            ...task, 
            completed: true,
            completedAt: new Date().toISOString()
          }
        : task
    )
    setTasks(updatedTasks)
    await saveTasksToAzure(updatedTasks)
    setConfirmCompleteTaskId(null)
  }

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    await saveTasksToAzure(updatedTasks)
    setDeleteConfirmTaskId(null)
  }

  // Add note
  const handleAddNote = async () => {
    if (!selectedToolForNotes || !newNoteContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter note content.",
        variant: "destructive",
      })
      return
    }

    const tool = tools.find((t) => t.id === selectedToolForNotes)
    if (!tool) return

    const newNote: ToolNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      toolId: selectedToolForNotes,
      toolName: tool.name,
      content: newNoteContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedNotes = [...toolNotes, newNote]
    setToolNotes(updatedNotes)
    await saveNotesToAzure(updatedNotes)
    
    setNewNoteContent("")
    setIsAddNoteDialogOpen(false)
    
    toast({
      title: "Success",
      description: "Note added successfully",
    })
  }

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = toolNotes.filter(n => n.id !== noteId)
    setToolNotes(updatedNotes)
    await saveNotesToAzure(updatedNotes)
    setDeleteConfirmNoteId(null)
    
    toast({
      title: "Success",
      description: "Note deleted successfully",
    })
  }

  // Manual sync
  const handleManualSync = async () => {
    setSyncing(true)
    await Promise.all([loadTasksFromAzure(), loadNotesFromAzure()])
    setSyncing(false)
  }

  // Download CSV locally
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

  // Upload CSV
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

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks
    if (filterBy === "active") filtered = filtered.filter((t) => !t.completed)
    if (filterBy === "completed") filtered = filtered.filter((t) => t.completed)
    if (toolFilter) filtered = filtered.filter((t) => t.toolId === toolFilter)

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "createdAt":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 }
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        default:
          return 0
      }
    })
  }, [tasks, sortBy, filterBy, toolFilter])

  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.id.toLowerCase().includes(toolSearchQuery.toLowerCase())
    )
  }, [tools, toolSearchQuery])

  const getNotesForTool = (toolId: string) => {
    return toolNotes.filter(note => note.toolId === toolId)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek }
  }

  const handlePreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  const handleDateClick = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(selected)
  }

  const handleAddTask = () => {
    if (!selectedDate) {
      toast({
        title: "No Date Selected",
        description: "Please select a date first.",
        variant: "destructive",
      })
      return
    }
    setIsAddDialogOpen(true)
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateStr)
  }

  const getActiveTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateStr && !task.completed)
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []
  const activeTasks = selectedDateTasks.filter((t) => !t.completed)
  const completedTasks = selectedDateTasks.filter((t) => t.completed)
  
  const currentMonthTasks = tasks.filter(task => {
    const taskDate = new Date(task.date)
    return taskDate.getMonth() === currentDate.getMonth() && 
           taskDate.getFullYear() === currentDate.getFullYear()
  })
  const currentMonthActive = currentMonthTasks.filter(t => !t.completed)
  const currentMonthCompleted = currentMonthTasks.filter(t => t.completed)

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
  }

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false
    return day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  const selectedToolData = selectedToolForNotes ? tools.find(t => t.id === selectedToolForNotes) : null
  const selectedToolNotes = selectedToolForNotes ? getNotesForTool(selectedToolForNotes) : []

  return (
    <div className="space-y-6">
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">Manage tool-related tasks with Azure Blob Storage</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSync}
              disabled={syncing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {syncing ? "Syncing..." : "Sync"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg shadow-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="createdAt">Creation Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Select value={filterBy} onValueChange={(v) => setFilterBy(v as any)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Filter by Tool ID"
                    value={toolFilter}
                    onChange={(e) => setToolFilter(e.target.value)}
                    className="w-[150px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2 bg-muted/50 rounded">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-24" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const dayTasks = getActiveTasksForDay(day)
                  const isCurrentDay = isToday(day)
                  const isSelected = isSelectedDate(day)

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        group h-24 p-2 rounded-lg border transition-all flex flex-col
                        ${isCurrentDay 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border bg-card hover:border-primary/40"
                        }
                        ${isSelected 
                          ? "ring-2 ring-primary ring-offset-1 shadow-md" 
                          : "hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`
                          text-sm font-medium
                          ${isCurrentDay ? "text-primary font-bold" : "text-foreground"}
                          ${isSelected ? "text-primary" : ""}
                        `}>
                          {day}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>
                      
                      {dayTasks.length > 0 && (
                        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded truncate text-left border border-primary/20"
                            >
                              {task.toolId}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <span className="text-[9px] text-muted-foreground text-center">
                              +{dayTasks.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {dayTasks.length === 0 && (
                        <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-foreground mb-4">
              Summary - {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-semibold text-foreground">{currentMonthTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="text-lg font-semibold text-foreground">{currentMonthActive.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-lg font-semibold text-foreground">{currentMonthCompleted.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">Tasks</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedDate
                    ? `${activeTasks.length} active on ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : "Select a date"}
                </p>
              </div>
              {selectedDate && (
                <Button size="sm" onClick={handleAddTask} className="h-8">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="p-4">
              {selectedDate ? (
                activeTasks.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {activeTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-2 rounded border border-border bg-background hover:bg-accent transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleTask(task.id)
                              }}
                              className="w-3 h-3 rounded border border-border hover:border-primary transition-colors flex-shrink-0"
                            ></button>
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => setSelectedToolForNotes(task.toolId)}
                                className="text-xs font-medium text-primary mb-0.5 hover:underline"
                              >
                                {task.toolId}
                              </button>
                              <p className="text-sm text-foreground truncate">{task.note}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleTask(task.id)
                            }}
                            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                            title="Mark as completed"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Select a date</p>
                </div>
              )}
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div className="bg-card border border-border rounded-lg shadow-md">
              <button
                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                className="w-full p-4 border-b border-border flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-foreground">Completed</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedTasks.length} task{completedTasks.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${showCompletedTasks ? 'rotate-90' : ''}`} />
              </button>
              {showCompletedTasks && (
                <div className="p-4">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-2 rounded border border-border bg-background hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => setSelectedToolForNotes(task.toolId)}
                            className="text-xs font-medium text-muted-foreground mb-0.5 hover:underline"
                          >
                            {task.toolId}
                          </button>
                          <p className="text-sm text-muted-foreground line-through truncate">{task.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tool Notes Panel */}
      {selectedToolForNotes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Tool Notes</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedToolData?.name} ({selectedToolForNotes})
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsAddNoteDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Note
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedToolForNotes(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedToolNotes.length > 0 ? (
                <div className="space-y-3">
                  {selectedToolNotes
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((note) => (
                      <div
                        key={note.id}
                        className="p-4 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmNoteId(note.id)}
                            className="flex-shrink-0 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Created: {new Date(note.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">No notes yet</p>
                  <p className="text-xs text-muted-foreground">Click "Add Note" to create your first note</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              {selectedDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Tool</label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tools..."
                    value={toolSearchQuery}
                    onChange={(e) => {
                      setToolSearchQuery(e.target.value)
                      setShowToolDropdown(true)
                    }}
                    onFocus={() => setShowToolDropdown(true)}
                    className="pl-9"
                  />
                </div>
                {showToolDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredTools.length > 0 ? (
                      filteredTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            setSelectedToolId(tool.id)
                            setToolSearchQuery(tool.name)
                            setShowToolDropdown(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                        >
                          <div className="font-medium text-foreground">{tool.name}</div>
                          <div className="text-xs text-muted-foreground">{tool.id}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">No tools found</div>
                    )}
                  </div>
                )}
              </div>
              {selectedToolId && (
                <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                  <p className="text-sm text-foreground">
                    Selected: <span className="font-semibold">{tools.find((t) => t.id === selectedToolId)?.name}</span>
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Note</label>
              <Input placeholder="Task details..." value={taskNote} onChange={(e) => setTaskNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setToolSearchQuery("")
                setSelectedToolId("")
                setTaskNote("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTask} disabled={syncing}>
              {syncing ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              {selectedToolData?.name} ({selectedToolForNotes})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Note Content</label>
              <Textarea
                placeholder="Enter your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddNoteDialogOpen(false)
                setNewNoteContent("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog
        open={deleteConfirmTaskId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmTaskId(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmTaskId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirmTaskId && handleDeleteTask(deleteConfirmTaskId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Note Confirmation Dialog */}
      <Dialog
        open={deleteConfirmNoteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmNoteId(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Note?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmNoteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirmNoteId && handleDeleteNote(deleteConfirmNoteId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Task Confirmation Dialog */}
      <Dialog
        open={confirmCompleteTaskId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmCompleteTaskId(null)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Task as Complete?</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this task as completed?
            </DialogDescription>
          </DialogHeader>
          {confirmCompleteTaskId && (
            <div className="py-4 space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-semibold text-primary mb-1">
                  {tasks.find(t => t.id === confirmCompleteTaskId)?.toolId}
                </div>
                <p className="text-sm text-foreground">
                  {tasks.find(t => t.id === confirmCompleteTaskId)?.note}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCompleteTaskId(null)}>
              Cancel
            </Button>
            <Button onClick={confirmTaskCompletion}>
              <Check className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}