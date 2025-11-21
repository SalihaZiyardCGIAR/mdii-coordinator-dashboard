import { useState } from "react"

export const useCalendarState = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedToolForNotes, setSelectedToolForNotes] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false)
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null)
  const [deleteConfirmNoteId, setDeleteConfirmNoteId] = useState<string | null>(null)
  const [confirmCompleteTaskId, setConfirmCompleteTaskId] = useState<string | null>(null)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "createdAt">("date")
  const [filterBy, setFilterBy] = useState<"all" | "active" | "completed">("all")
  const [toolFilter, setToolFilter] = useState<string>("")

  return {
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
  }
}