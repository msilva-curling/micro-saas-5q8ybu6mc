import { useState, useEffect, useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'

type PermissionStatus = 'default' | 'granted' | 'denied'

export const useNotifications = () => {
  const [permission, setPermission] = useState<PermissionStatus>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Notificações não suportadas',
        description: 'Este navegador não suporta notificações no desktop.',
        variant: 'destructive',
      })
      return 'denied'
    }

    const currentPermission = await Notification.requestPermission()
    setPermission(currentPermission)

    if (currentPermission === 'granted') {
      toast({
        title: 'Permissão concedida!',
        description: 'Você receberá lembretes dos seus hábitos.',
      })
    } else if (currentPermission === 'denied') {
      toast({
        title: 'Permissão negada',
        description:
          'Para receber lembretes, por favor, habilite as notificações nas configurações do seu navegador.',
        variant: 'destructive',
      })
    }
    return currentPermission
  }, [])

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission !== 'granted') {
        console.warn('Notification permission not granted.')
        return
      }
      new Notification(title, {
        ...options,
        icon: '/favicon.ico',
        body: options?.body || 'É hora de construir um bom hábito!',
      })
    },
    [permission],
  )

  return { permission, requestNotificationPermission, sendNotification }
}
