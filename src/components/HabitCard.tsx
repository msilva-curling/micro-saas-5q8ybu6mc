import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Flame, Target } from 'lucide-react'
import { Habit } from '@/types/habit'
import { useHabits } from '@/hooks/useHabits'
import { cn, getStreak, getWeeklyCompletions } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from '@/components/ui/use-toast'
import { Progress } from '@/components/ui/progress'

interface HabitCardProps {
  habit: Habit
}

export const HabitCard = ({ habit }: HabitCardProps) => {
  const { toggleHabitCompletion } = useHabits()
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isCompletedToday = !!habit.completions[todayStr]
  const [showUndo, setShowUndo] = useState(false)

  const { current: currentStreak } = getStreak(habit.completions)
  const weeklyCompletions = useMemo(
    () => getWeeklyCompletions(habit.completions),
    [habit.completions],
  )

  const isWeeklyGoalMet =
    habit.goalType === 'weekly' && weeklyCompletions >= (habit.weeklyGoal ?? 0)

  const isCompleted =
    habit.goalType === 'daily' ? isCompletedToday : isWeeklyGoalMet

  const handleComplete = () => {
    toggleHabitCompletion(habit.id, todayStr)
    if (!isCompletedToday) {
      setShowUndo(true)
      setTimeout(() => setShowUndo(false), 3000)
    }
  }

  const handleUndo = () => {
    toggleHabitCompletion(habit.id, todayStr)
    setShowUndo(false)
    toast({ title: 'Ação desfeita.' })
  }

  const progressValue =
    habit.goalType === 'weekly'
      ? (weeklyCompletions / (habit.weeklyGoal || 1)) * 100
      : isCompletedToday
        ? 100
        : 0

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 flex flex-col',
        isCompleted && 'bg-green-50 border-green-200',
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle
            className={cn(
              'text-lg',
              isCompleted && 'line-through text-muted-foreground',
            )}
          >
            {habit.name}
          </CardTitle>
          <div className="flex items-center gap-1 text-secondary font-semibold">
            <Flame className="h-4 w-4" />
            <span>{currentStreak}</span>
          </div>
        </div>
        <CardDescription
          className={cn(isCompleted && 'line-through text-muted-foreground')}
        >
          {habit.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {habit.goalType === 'weekly' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Progresso Semanal</span>
              </div>
              <span>
                {weeklyCompletions}/{habit.weeklyGoal}
              </span>
            </div>
            <Progress value={progressValue} />
          </div>
        )}
        <Button
          onClick={handleComplete}
          disabled={isCompletedToday}
          className={cn(
            'w-full transition-all duration-300',
            isCompletedToday
              ? 'bg-success hover:bg-success/90'
              : 'bg-primary hover:bg-primary-hover',
          )}
        >
          {isCompletedToday ? <Check className="mr-2 h-4 w-4" /> : null}
          {isCompletedToday ? 'Concluído Hoje!' : 'Marcar como Concluído'}
        </Button>
      </CardContent>
      {showUndo && isCompletedToday && (
        <CardFooter>
          <Button
            variant="link"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={handleUndo}
          >
            Desfazer
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
