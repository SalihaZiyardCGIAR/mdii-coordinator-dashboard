import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from "@/types/types"
import { getDaysInMonth } from "@/lib/dateUtils"
import { KOBO_CONFIG } from "@/config/koboConfig";

interface CalendarGridProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  selectedDate: Date | null
  tasks: Task[]
  sortBy: "date" | "createdAt"
  setSortBy: (value: "date" | "createdAt") => void
  filterBy: "all" | "active" | "completed"
  setFilterBy: (value: "all" | "active" | "completed") => void
  toolFilter: string
  setToolFilter: (value: string) => void
  onDateClick: (day: number) => void
}

export const CalendarGrid = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  tasks,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  toolFilter,
  setToolFilter,
  onDateClick,
}: CalendarGridProps) => {
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthNames = KOBO_CONFIG.MONTH_NAMES;
  const dayNames = KOBO_CONFIG.DAY_NAMES_SHORT;

  const handlePreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const getActiveTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateStr && !task.completed)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
  }

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false
    return day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear()
  }

  return (
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
                onClick={() => onDateClick(day)}
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
  )
}