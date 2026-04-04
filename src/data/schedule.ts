export interface DaySchedule {
  open: string
  close: string
}

// 0 = Sunday, 1 = Monday, ..., 6 = Saturday
export const schedule: Record<number, DaySchedule | null> = {
  0: null,
  1: { open: '14:00', close: '22:00' },
  2: { open: '14:00', close: '22:00' },
  3: { open: '14:00', close: '22:00' },
  4: { open: '14:00', close: '22:00' },
  5: { open: '14:00', close: '22:00' },
  6: { open: '14:00', close: '22:00' },
}

export function getTimeSlots(dayOfWeek: number): string[] {
  const day = schedule[dayOfWeek]
  if (!day) return []

  const slots: string[] = []
  const [openH, openM] = day.open.split(':').map(Number)
  const [closeH, closeM] = day.close.split(':').map(Number)
  const closeMinutes = closeH * 60 + closeM

  let h = openH
  let m = openM
  while (h * 60 + m <= closeMinutes - 30) {
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    m += 30
    if (m >= 60) { h++; m -= 60 }
  }

  return slots
}

export interface SlotGroup {
  key: 'morning' | 'afternoon' | 'evening'
  slots: string[]
}

export function groupSlots(slots: string[]): SlotGroup[] {
  const groups: SlotGroup[] = []
  const morning = slots.filter((s) => parseInt(s) < 12)
  const afternoon = slots.filter((s) => { const h = parseInt(s); return h >= 12 && h < 18 })
  const evening = slots.filter((s) => parseInt(s) >= 18)

  if (morning.length) groups.push({ key: 'morning', slots: morning })
  if (afternoon.length) groups.push({ key: 'afternoon', slots: afternoon })
  if (evening.length) groups.push({ key: 'evening', slots: evening })

  return groups
}

export function formatTime(slot: string): string {
  const [h, m] = slot.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`
}

export function formatDateLabel(dateStr: string, lang: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}
