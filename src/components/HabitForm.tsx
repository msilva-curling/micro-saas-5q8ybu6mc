import { useForm, FieldErrors } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useHabits } from '@/hooks/useHabits'
import {
  Habit,
  AllDays,
  Weekdays,
  Weekends,
  ALL_DAYS_TUPLE,
} from '@/types/habit'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { useNotifications } from '@/hooks/useNotifications'

const habitSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    description: z.string().optional(),
    frequency: z
      .array(z.enum(ALL_DAYS_TUPLE))
      .min(1, 'Selecione pelo menos um dia.'),
    color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Cor inválida.'),
    reminderEnabled: z.boolean().optional(),
    reminderTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.reminderEnabled && !data.reminderTime) {
        return false
      }
      return true
    },
    {
      message: 'Por favor, defina um horário para o lembrete.',
      path: ['reminderTime'],
    },
  )

type HabitFormData = z.infer<typeof habitSchema>

const colorPalette = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
]

const customResolver = async (data: HabitFormData) => {
  try {
    const validatedData = await habitSchema.parseAsync(data)
    return { values: validatedData, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        values: {},
        errors: error.issues.reduce((acc, issue) => {
          acc[issue.path[0] as keyof HabitFormData] = {
            type: issue.code,
            message: issue.message,
          }
          return acc
        }, {} as FieldErrors<HabitFormData>),
      }
    }
    throw error
  }
}

interface HabitFormProps {
  habitToEdit?: Habit | null
  onCancel?: () => void
}

export const HabitForm = ({ habitToEdit, onCancel }: HabitFormProps) => {
  const { addHabit, updateHabit } = useHabits()
  const { requestNotificationPermission } = useNotifications()
  const form = useForm<HabitFormData>({
    resolver: customResolver,
    defaultValues: {
      name: '',
      description: '',
      frequency: [...AllDays],
      color: colorPalette[0],
      reminderEnabled: false,
      reminderTime: '09:00',
    },
  })

  const reminderEnabled = form.watch('reminderEnabled')

  useEffect(() => {
    if (habitToEdit) {
      form.reset({
        ...habitToEdit,
        reminderEnabled: habitToEdit.reminderEnabled ?? false,
        reminderTime: habitToEdit.reminderTime ?? '09:00',
      })
    } else {
      form.reset({
        name: '',
        description: '',
        frequency: [...AllDays],
        color: colorPalette[0],
        reminderEnabled: false,
        reminderTime: '09:00',
      })
    }
  }, [habitToEdit, form])

  const handleReminderToggle = async (checked: boolean) => {
    if (checked) {
      const permission = await requestNotificationPermission()
      form.setValue('reminderEnabled', permission === 'granted')
    } else {
      form.setValue('reminderEnabled', false)
    }
  }

  const onSubmit = (data: HabitFormData) => {
    if (habitToEdit) {
      updateHabit({ ...habitToEdit, ...data })
    } else {
      addHabit(data)
    }
    form.reset()
    onCancel?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {habitToEdit ? 'Editar Hábito' : 'Adicionar Novo Hábito'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Hábito</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Beber 2 litros de água"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição ou Meta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Manter-se hidratado durante o dia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <FormControl>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange([...AllDays])}
                        >
                          Todos os dias
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange([...Weekdays])}
                        >
                          Dias da semana
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange([...Weekends])}
                        >
                          Fins de semana
                        </Button>
                      </div>
                      <ToggleGroup
                        type="multiple"
                        className="mt-2 justify-start flex-wrap"
                        onValueChange={field.onChange}
                        value={field.value || []}
                      >
                        {AllDays.map((day) => (
                          <ToggleGroupItem key={day} value={day}>
                            {day}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap">
                      {colorPalette.map((color) => (
                        <button
                          type="button"
                          key={color}
                          onClick={() => field.onChange(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${field.value === color ? 'border-primary ring-2 ring-primary/50' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reminderEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Lembretes</FormLabel>
                    <FormDescription>
                      Receber uma notificação para este hábito.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handleReminderToggle}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {reminderEnabled && (
              <FormField
                control={form.control}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem className="animate-fade-in-up">
                    <FormLabel>Horário do Lembrete</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="w-40" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex gap-4">
              <Button type="submit">
                {habitToEdit ? 'Salvar Alterações' : 'Salvar Hábito'}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
