import { Task } from "../types/types"

interface UseTaskActionsProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  tools: any[]
  selectedDate: Date | null
  saveTasksToAzure: (tasks: Task[]) => Promise<void>
  setIsAddDialogOpen: (open: boolean) => void
  setConfirmCompleteTaskId: (id: string | null) => void
  setDeleteConfirmTaskId: (id: string | null) => void
  toast: any
}

export const useTaskActions = ({
  tasks,
  setTasks,
  tools,
  selectedDate,
  saveTasksToAzure,
  setIsAddDialogOpen,
  setConfirmCompleteTaskId,
  setDeleteConfirmTaskId,
  toast,
}: UseTaskActionsProps) => {
  const handleSaveTask = async (toolId: string, note: string) => {
    if (!toolId || !note.trim() || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a tool and enter a note.",
        variant: "destructive",
      })
      return
    }

    const tool = tools.find((t) => t.id === toolId)
    if (!tool) return

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      toolId,
      toolName: tool.name,
      note,
      date: selectedDate.toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "medium",
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    await saveTasksToAzure(updatedTasks)
    setIsAddDialogOpen(false)
  }

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

  const confirmTaskCompletion = async () => {
    const taskId = tasks.find(t => t.id)?.id
    if (!taskId) return
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
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

  const handleDeleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    await saveTasksToAzure(updatedTasks)
    setDeleteConfirmTaskId(null)
  }

  return {
    handleSaveTask,
    handleToggleTask,
    confirmTaskCompletion,
    handleDeleteTask,
  }
}