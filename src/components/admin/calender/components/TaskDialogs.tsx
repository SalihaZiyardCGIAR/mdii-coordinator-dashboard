import { AddTaskDialog } from "./AddTaskDialog"
import { AddNoteDialog } from "./AddNoteDialog"
import { ConfirmDialog } from "./ConfirmDialog"
import { Check } from "lucide-react"
import { Task } from "@/types/types"

interface TaskDialogsProps {
  isAddDialogOpen: boolean
  setIsAddDialogOpen: (open: boolean) => void
  isAddNoteDialogOpen: boolean
  setIsAddNoteDialogOpen: (open: boolean) => void
  deleteConfirmTaskId: string | null
  setDeleteConfirmTaskId: (id: string | null) => void
  deleteConfirmNoteId: string | null
  setDeleteConfirmNoteId: (id: string | null) => void
  confirmCompleteTaskId: string | null
  setConfirmCompleteTaskId: (id: string | null) => void
  selectedDate: Date | null
  selectedToolForNotes: string | null
  tools: any[]
  tasks: Task[]
  syncing: boolean
  onSaveTask: (toolId: string, note: string) => void
  onAddNote: (content: string) => void
  onDeleteTask: (taskId: string) => void
  onDeleteNote: (noteId: string) => void
  onConfirmComplete: (taskId: string) => void  
}

export const TaskDialogs = ({
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
  selectedDate,
  selectedToolForNotes,
  tools,
  tasks,
  syncing,
  onSaveTask,
  onAddNote,
  onDeleteTask,
  onDeleteNote,
  onConfirmComplete,
}: TaskDialogsProps) => {
  const selectedToolData = selectedToolForNotes ? tools.find(t => t.id === selectedToolForNotes) : null
  const taskToComplete = confirmCompleteTaskId ? tasks.find(t => t.id === confirmCompleteTaskId) : null

  return (
    <>
      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        selectedDate={selectedDate}
        tools={tools}
        syncing={syncing}
        onSave={onSaveTask}
      />

      <AddNoteDialog
        open={isAddNoteDialogOpen}
        onOpenChange={setIsAddNoteDialogOpen}
        toolData={selectedToolData}
        toolId={selectedToolForNotes}
        onSave={onAddNote}
      />

      <ConfirmDialog
        open={deleteConfirmTaskId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmTaskId(null)}
        title="Delete Task?"
        description="This action cannot be undone."
        onConfirm={() => deleteConfirmTaskId && onDeleteTask(deleteConfirmTaskId)}
        onCancel={() => setDeleteConfirmTaskId(null)}
        confirmVariant="destructive"
        confirmText="Delete"
      />

      <ConfirmDialog
        open={deleteConfirmNoteId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmNoteId(null)}
        title="Delete Note?"
        description="This action cannot be undone."
        onConfirm={() => deleteConfirmNoteId && onDeleteNote(deleteConfirmNoteId)}
        onCancel={() => setDeleteConfirmNoteId(null)}
        confirmVariant="destructive"
        confirmText="Delete"
      />

      <ConfirmDialog
        open={confirmCompleteTaskId !== null}
        onOpenChange={(open) => !open && setConfirmCompleteTaskId(null)}
        title="Mark Task as Complete?"
        description="Are you sure you want to mark this task as completed?"
        onConfirm={() => confirmCompleteTaskId && onConfirmComplete(confirmCompleteTaskId)}  
        onCancel={() => setConfirmCompleteTaskId(null)}
        confirmText="Mark Complete"
        confirmIcon={<Check className="h-4 w-4 mr-2" />}
      >
        {taskToComplete && (
          <div className="py-4 space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-semibold text-primary mb-1">
                {taskToComplete.toolId}
              </div>
              <p className="text-sm text-foreground">
                {taskToComplete.note}
              </p>
            </div>
          </div>
        )}
      </ConfirmDialog>
    </>
  )
}