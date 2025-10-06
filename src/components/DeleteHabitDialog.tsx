import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useHabits } from '@/hooks/useHabits'
import { Habit } from '@/types/habit'

interface DeleteHabitDialogProps {
  habit: Habit
  onOpenChange: (open: boolean) => void
}

export const DeleteHabitDialog = ({
  habit,
  onOpenChange,
}: DeleteHabitDialogProps) => {
  const { deleteHabit } = useHabits()

  const handleDelete = () => {
    deleteHabit(habit.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Hábito</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o hábito "{habit.name}"? Esta ação
            não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
