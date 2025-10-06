import { Calendar } from '@/components/ui/calendar'
import { Habit } from '@/types/habit'
import { useState } from 'react'
import { format } from 'date-fns'

interface CalendarHeatmapProps {
  habit: Habit
}

export const CalendarHeatmap = ({ habit }: CalendarHeatmapProps) => {
  const [month, setMonth] = useState(new Date())

  const completedDays = Object.keys(habit.completions)
    .filter((dateStr) => habit.completions[dateStr])
    .map((dateStr) => new Date(dateStr))

  return (
    <Calendar
      mode="multiple"
      selected={completedDays}
      month={month}
      onMonthChange={setMonth}
      className="rounded-md border w-full"
      classNames={{
        day_selected: `bg-opacity-75 text-white`,
      }}
      modifiers={{
        completed: completedDays,
      }}
      modifiersStyles={{
        completed: {
          backgroundColor: habit.color,
          color: '#fff',
        },
        today: {
          borderColor: habit.color,
        },
      }}
      footer={
        <div className="text-sm text-muted-foreground p-2">
          Dias com o hábito concluído são destacados.
        </div>
      }
    />
  )
}
