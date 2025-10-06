import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useHabits } from '@/hooks/useHabits'
import { formatDate, isHabitScheduledForToday, getStreak } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { HabitCard } from '@/components/HabitCard'
import { format } from 'date-fns'

export default function Index() {
  const { habits } = useHabits()
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')

  const dailyHabits = useMemo(
    () => habits.filter(isHabitScheduledForToday),
    [habits],
  )

  const completedTodayCount = useMemo(() => {
    return dailyHabits.filter((h) => h.completions[todayStr]).length
  }, [dailyHabits, todayStr])

  const bestStreakOverall = useMemo(() => {
    return habits.reduce((max, habit) => {
      const { best } = getStreak(habit.completions)
      return Math.max(max, best)
    }, 0)
  }, [habits])

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          Olá! Vamos construir bons hábitos hoje?
        </h1>
        <p className="text-lg text-text-secondary mt-2">{formatDate(today)}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Hábitos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dailyHabits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Concluídos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedTodayCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Melhor Sequência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bestStreakOverall} dias</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Seus hábitos de hoje
        </h2>
        {dailyHabits.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dailyHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-lg text-text-secondary">
              Nenhum hábito para hoje.
            </p>
            <Button asChild className="mt-4">
              <Link to="/habitos">Adicionar Novo Hábito</Link>
            </Button>
          </div>
        )}
      </div>

      <Button
        asChild
        size="lg"
        className="fixed bottom-8 right-8 rounded-full shadow-lg h-16 w-16"
      >
        <Link to="/habitos">
          <Plus className="h-8 w-8" />
        </Link>
      </Button>
    </div>
  )
}
