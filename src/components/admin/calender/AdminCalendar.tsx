"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/context/DataContext"
import { useToast } from "@/hooks/use-toast"
import { CalendarGrid } from "./components/CalendarGrid"
import { CalendarSidebar } from "./components/CalendarSidebar"
import { TaskDialogs } from "./components/TaskDialogs"
import { ToolNotesPanel } from "./components/ToolNotesPanel"
import { useCalendarData } from "@/hooks/useCalendarData"
import { useCalendarState } from "@/hooks/useCalendarState"
import { useTaskActions } from "@/hooks/useTaskActions"
import { useNoteActions } from "@/hooks/useNoteActions"

export function AdminCalendar() {
  const { tools } = useData()
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const {
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
  } = useCalendarData()

  const {
    selectedDate,
    setSelectedDate,
    selectedToolForNotes,
    setSelectedToolForNotes,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isAddNoteDialogOpen,
    setIsAddNoteDialogOpen,
    deleteConfirmTaskId,
    setDeleteConfirmTaskId,
    deleteConfirmNoteId,
    setDeleteConfirmNoteId,
    confirmCompleteTaskId,
    setConfirmCompleteTaskId,
    showCompletedTasks,
    setShowCompletedTasks,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    toolFilter,
    setToolFilter,
  } = useCalendarState()

  const {
    handleSaveTask,
    handleToggleTask,
    confirmTaskCompletion,
    handleDeleteTask,
  } = useTaskActions({
    tasks,
    setTasks,
    tools,
    selectedDate,
    saveTasksToAzure,
    setIsAddDialogOpen,
    setConfirmCompleteTaskId,
    setDeleteConfirmTaskId,
    toast,
  })

  const {
    handleAddNote,
    handleDeleteNote,
  } = useNoteActions({
    toolNotes,
    setToolNotes,
    tools,
    selectedToolForNotes,
    saveNotesToAzure,
    setIsAddNoteDialogOpen,
    setDeleteConfirmNoteId,
    toast,
  })

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadTasksFromAzure(), loadNotesFromAzure()])
    }
    loadData()
  }, [])

  const handleManualSync = async () => {
    await Promise.all([loadTasksFromAzure(), loadNotesFromAzure()])
  }

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

  return (
    <div className="space-y-6">
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">Manage tool-related tasks</p>
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
          <CalendarGrid
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            tasks={tasks}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            toolFilter={toolFilter}
            setToolFilter={setToolFilter}
            onDateClick={handleDateClick}
          />
        </div>

        <CalendarSidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          tasks={tasks}
          showCompletedTasks={showCompletedTasks}
          setShowCompletedTasks={setShowCompletedTasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onSelectTool={setSelectedToolForNotes}
        />
      </div>

      <ToolNotesPanel
        selectedToolForNotes={selectedToolForNotes}
        tools={tools}
        toolNotes={toolNotes}
        onClose={() => setSelectedToolForNotes(null)}
        onAddNote={() => setIsAddNoteDialogOpen(true)}
        onDeleteNote={setDeleteConfirmNoteId}
      />

      <TaskDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isAddNoteDialogOpen={isAddNoteDialogOpen}
        setIsAddNoteDialogOpen={setIsAddNoteDialogOpen}
        deleteConfirmTaskId={deleteConfirmTaskId}
        setDeleteConfirmTaskId={setDeleteConfirmTaskId}
        deleteConfirmNoteId={deleteConfirmNoteId}
        setDeleteConfirmNoteId={setDeleteConfirmNoteId}
        confirmCompleteTaskId={confirmCompleteTaskId}
        setConfirmCompleteTaskId={setConfirmCompleteTaskId}
        selectedDate={selectedDate}
        selectedToolForNotes={selectedToolForNotes}
        tools={tools}
        tasks={tasks}
        syncing={syncing}
        onSaveTask={handleSaveTask}
        onAddNote={handleAddNote}
        onDeleteTask={handleDeleteTask}
        onDeleteNote={handleDeleteNote}
        onConfirmComplete={confirmTaskCompletion}
      />
    </div>
  )
}