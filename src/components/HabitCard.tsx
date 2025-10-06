import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Flame } from 'lucide-react'
import { Habit } from '@/types/habit'
import { useHabits } from '@/hooks/useHabits'
import { cn, getStreak } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from './ui/use-toast'

interface HabitCardProps {
  habit: Habit
}

export const HabitCard = ({ habit }: HabitCardProps) => {
  const { toggleHabitCompletion } = useHabits()
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isCompleted = !!habit.completions[todayStr]
  const [showUndo, setShowUndo] = useState(false)

  const { current } = getStreak(habit.completions)

  const handleComplete = () => {
    toggleHabitCompletion(habit.id, todayStr)
    if (!isCompleted) {
      setShowUndo(true)
      setTimeout(() => setShowUndo(false), 3000)
    }
  }

  const handleUndo = () => {
    toggleHabitCompletion(habit.id, todayStr)
    setShowUndo(false)
    toast({ title: 'Ação desfeita.' })
  }

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1',
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
            <span>{current}</span>
          </div>
        </div>
        <CardDescription
          className={cn(isCompleted && 'line-through text-muted-foreground')}
        >
          {habit.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleComplete}
          className={cn(
            'w-full transition-all duration-300',
            isCompleted
              ? 'bg-success hover:bg-success/90'
              : 'bg-primary hover:bg-primary-hover',
          )}
        >
          {isCompleted ? <Check className="mr-2 h-4 w-4" /> : null}
          {isCompleted ? 'Concluído!' : 'Marcar como Concluído'}
        </Button>
      </CardContent>
      {showUndo && isCompleted && (
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
