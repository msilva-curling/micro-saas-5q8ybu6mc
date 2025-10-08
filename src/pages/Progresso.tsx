import { useState, useMemo } from 'react'
import { useHabits } from '@/hooks/useHabits'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarHeatmap } from '@/components/CalendarHeatmap'
import { getStreak, getWeeklyCompletions } from '@/lib/utils'
import { Flame, Trophy, Target } from 'lucide-react'

export default function ProgressoPage() {
  const { habits } = useHabits()
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(
    habits[0]?.id,
  )

  const selectedHabit = useMemo(() => {
    return habits.find((h) => h.id === selectedHabitId)
  }, [selectedHabitId, habits])

  const { current, best } = useMemo(() => {
    if (selectedHabit) {
      return getStreak(selectedHabit.completions)
    }
    return { current: 0, best: 0 }
  }, [selectedHabit])

  const weeklyCompletions = useMemo(() => {
    if (selectedHabit) {
      return getWeeklyCompletions(selectedHabit.completions)
    }
    return 0
  }, [selectedHabit])

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-foreground">Seu Progresso</h1>

      {habits.length > 0 ? (
        <>
          <Select
            onValueChange={setSelectedHabitId}
            defaultValue={selectedHabitId}
          >
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Selecione um hábito" />
            </SelectTrigger>
            <SelectContent>
              {habits.map((habit) => (
                <SelectItem key={habit.id} value={habit.id}>
                  {habit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedHabit && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">
                    Sequência Atual
                  </CardTitle>
                  <Flame className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{current} dias!</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">
                    Melhor Sequência
                  </CardTitle>
                  <Trophy className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{best} dias</div>
                </CardContent>
              </Card>
              {selectedHabit.goalType === 'weekly' && (
                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">
                      Completado esta Semana
                    </CardTitle>
                    <Target className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {weeklyCompletions} / {selectedHabit.weeklyGoal}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {selectedHabit && (
            <Card>
              <CardHeader>
                <CardTitle>Calendário de Conclusões</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarHeatmap habit={selectedHabit} />
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            Você ainda não tem hábitos para acompanhar o progresso.
          </p>
          <p className="text-muted-foreground">
            Adicione um hábito para começar!
          </p>
        </div>
      )}
    </div>
  )
}
