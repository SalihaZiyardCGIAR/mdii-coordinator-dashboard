import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TableFiltersProps {
  searchTerm: string;
  dateFilter: string;
  coordinatorFilter: string;
  customDateRange: { from?: Date; to?: Date };
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onCoordinatorFilterChange: (value: string) => void;
  onCustomDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

export const TableFilters = ({
  searchTerm,
  dateFilter,
  coordinatorFilter,
  customDateRange,
  onSearchChange,
  onDateFilterChange,
  onCoordinatorFilterChange,
  onCustomDateRangeChange,
}: TableFiltersProps) => {
  return (
    <div className="flex gap-4 mt-4">
      <Input
        placeholder="Search by tool name, ID, or coordinator..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      
      <Select value={dateFilter} onValueChange={onDateFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="entire">Entire Time</SelectItem>
          <SelectItem value="week">Last Week</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="custom">Custom Date Range</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={coordinatorFilter} onValueChange={onCoordinatorFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by coordinator" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Coordinators</SelectItem>
          <SelectItem value="assigned">Assigned</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
        </SelectContent>
      </Select>
      
      {dateFilter === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              {customDateRange.from ? (
                customDateRange.to ? (
                  <>
                    {format(customDateRange.from, "MMM dd, yyyy")} - {format(customDateRange.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(customDateRange.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: customDateRange.from, to: customDateRange.to }}
              onSelect={(range) => onCustomDateRangeChange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};