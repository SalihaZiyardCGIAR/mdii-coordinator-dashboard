import { ToolNote } from "../types/types"

interface UseNoteActionsProps {
  toolNotes: ToolNote[]
  setToolNotes: (notes: ToolNote[]) => void
  tools: any[]
  selectedToolForNotes: string | null
  saveNotesToAzure: (notes: ToolNote[]) => Promise<void>
  setIsAddNoteDialogOpen: (open: boolean) => void
  setDeleteConfirmNoteId: (id: string | null) => void
  toast: any
}

export const useNoteActions = ({
  toolNotes,
  setToolNotes,
  tools,
  selectedToolForNotes,
  saveNotesToAzure,
  setIsAddNoteDialogOpen,
  setDeleteConfirmNoteId,
  toast,
}: UseNoteActionsProps) => {
  const handleAddNote = async (content: string) => {
    if (!selectedToolForNotes || !content.trim()) {
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
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedNotes = [...toolNotes, newNote]
    setToolNotes(updatedNotes)
    await saveNotesToAzure(updatedNotes)
    setIsAddNoteDialogOpen(false)
    
    toast({
      title: "Success",
      description: "Note added successfully",
    })
  }

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

  return {
    handleAddNote,
    handleDeleteNote,
  }
}