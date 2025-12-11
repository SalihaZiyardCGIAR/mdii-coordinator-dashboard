import { Plus, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Task } from "@/types/types"
import { KOBO_CONFIG } from "@/config/koboConfig";


interface CalendarSidebarProps {
  currentDate: Date
  selectedDate: Date | null
  tasks: Task[]
  showCompletedTasks: boolean
  setShowCompletedTasks: (show: boolean) => void
  onAddTask: () => void
  onToggleTask: (taskId: string) => void
  onSelectTool: (toolId: string) => void
}

export const CalendarSidebar = ({
  currentDate,
  selectedDate,
  tasks,
  showCompletedTasks,
  setShowCompletedTasks,
  onAddTask,
  onToggleTask,
  onSelectTool,
}: CalendarSidebarProps) => {
  const monthNames = KOBO_CONFIG.MONTH_NAMES

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateStr)
  }

  const currentMonthTasks = tasks.filter(task => {
    const taskDate = new Date(task.date)
    return taskDate.getMonth() === currentDate.getMonth() && 
           taskDate.getFullYear() === currentDate.getFullYear()
  })
  const currentMonthActive = currentMonthTasks.filter(t => !t.completed)
  const currentMonthCompleted = currentMonthTasks.filter(t => t.completed)

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []
  const activeTasks = selectedDateTasks.filter((t) => !t.completed)
  const completedTasks = selectedDateTasks.filter((t) => t.completed)

  return (
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
            <Button size="sm" onClick={onAddTask} className="h-8">
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
                    className="p-2 rounded border border-border bg-background hover:bg-sidebar-accent transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleTask(task.id)
                          }}
                          className="w-3 h-3 rounded border border-border hover:border-primary transition-colors flex-shrink-0"
                        ></button>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => onSelectTool(task.toolId)}
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
                          onToggleTask(task.id)
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
            className="w-full p-4 border-b border-border flex items-center justify-between hover:bg-sidebar-accent transition-colors"
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
                    className="p-2 rounded border border-border bg-background hover:bg-sidebar-accent transition-colors flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onSelectTool(task.toolId)}
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
  )
}