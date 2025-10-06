import { useContext } from 'react'
import { HabitContext } from '@/contexts/HabitContext'

export function useHabits() {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider')
  }
  return context
}
