import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { Habit, AllDays, Weekdays } from '@/types/habit'
import { toast } from '@/components/ui/use-toast'

interface HabitContextType {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void
  updateHabit: (habit: Habit) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (id: string, date: string) => void
  getHabitById: (id: string) => Habit | undefined
}

export const HabitContext = createContext<HabitContextType | undefined>(
  undefined,
)

const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Beber 2 litros de água',
    description: 'Manter-se hidratado durante o dia.',
    frequency: AllDays,
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
    completions: { '2025-10-05': true, '2025-10-04': true },
    reminderEnabled: true,
    reminderTime: '09:00',
    goalType: 'daily',
  },
  {
    id: '2',
    name: 'Ler 30 minutos',
    description: 'Ler um livro de ficção ou não-ficção.',
    frequency: Weekdays,
    color: '#8b5cf6',
    createdAt: new Date().toISOString(),
    completions: { '2025-10-03': true },
    reminderEnabled: false,
    goalType: 'daily',
  },
  {
    id: '3',
    name: 'Ir à academia',
    description: 'Fazer treino de musculação.',
    frequency: ['Seg', 'Qua', 'Sex'],
    color: '#ef4444',
    createdAt: new Date().toISOString(),
    completions: { '2025-10-03': true },
    reminderEnabled: true,
    reminderTime: '18:00',
    goalType: 'weekly',
    weeklyGoal: 3,
  },
]

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const storedHabits = localStorage.getItem('habits')
      if (storedHabits) {
        const parsedHabits = JSON.parse(storedHabits)
        return parsedHabits.map((h: Habit) => ({
          ...h,
          goalType: h.goalType || 'daily',
        }))
      }
      localStorage.setItem('habits', JSON.stringify(initialHabits))
      return initialHabits
    } catch (error) {
      console.error('Failed to parse habits from localStorage', error)
      return initialHabits
    }
  })

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
      const newHabit: Habit = {
        ...habitData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        completions: {},
        weeklyGoal:
          habitData.goalType === 'weekly' ? habitData.weeklyGoal : undefined,
      }
      setHabits((prev) => [...prev, newHabit])
      toast({ title: 'Hábito salvo com sucesso!' })
    },
    [],
  )

  const updateHabit = useCallback((updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === updatedHabit.id
          ? {
              ...updatedHabit,
              weeklyGoal:
                updatedHabit.goalType === 'weekly'
                  ? updatedHabit.weeklyGoal
                  : undefined,
            }
          : h,
      ),
    )
    toast({ title: 'Hábito atualizado com sucesso!' })
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
    toast({ title: 'Hábito excluído.', variant: 'destructive' })
  }, [])

  const toggleHabitCompletion = useCallback((id: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newCompletions = { ...h.completions }
          if (newCompletions[date]) {
            delete newCompletions[date]
          } else {
            newCompletions[date] = true
          }
          return { ...h, completions: newCompletions }
        }
        return h
      }),
    )
  }, [])

  const getHabitById = useCallback(
    (id: string) => {
      return habits.find((h) => h.id === id)
    },
    [habits],
  )

  const value = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitById,
  }

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
}
