import { useState } from 'react'
import { useHabits } from '@/hooks/useHabits'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import { Habit, Weekdays, Weekends, AllDays, Day } from '@/types/habit'
import { HabitForm } from '@/components/HabitForm'
import { DeleteHabitDialog } from '@/components/DeleteHabitDialog'

const frequencyMap = (freq: Day[]) => {
  const freqSet = new Set(freq)
  if (freqSet.size === 7) return 'Todos os dias'

  const weekdaysSet = new Set(Weekdays)
  const weekendsSet = new Set(Weekends)

  const isSameSet = (a: Set<Day>, b: Set<Day>) =>
    a.size === b.size && [...a].every((value) => b.has(value))

  if (isSameSet(freqSet, weekdaysSet)) return 'Dias da semana'
  if (isSameSet(freqSet, weekendsSet)) return 'Fins de semana'

  return [...freq]
    .sort((a, b) => AllDays.indexOf(a) - AllDays.indexOf(b))
    .join(', ')
}

export default function HabitosPage() {
  const { habits } = useHabits()
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingHabit(null)
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-text-primary">Meus Hábitos</h1>

      <HabitForm habitToEdit={editingHabit} onCancel={handleCancelEdit} />

      <Card>
        <CardHeader>
          <CardTitle>Hábitos Criados</CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length > 0 ? (
            <ul className="space-y-4">
              {habits.map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <p className="font-semibold text-card-foreground">
                        {habit.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {frequencyMap(habit.frequency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(habit)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingHabit(habit)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum hábito ainda. Que tal adicionar um?
            </p>
          )}
        </CardContent>
      </Card>

      {deletingHabit && (
        <DeleteHabitDialog
          habit={deletingHabit}
          onOpenChange={(isOpen) => !isOpen && setDeletingHabit(null)}
        />
      )}
    </div>
  )
}
