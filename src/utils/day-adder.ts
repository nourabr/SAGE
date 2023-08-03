export function dayAdder(day?: number, date?: Date) {
  if (!date) {
    date = new Date()
  }

  if (!day) {
    day = 1
  }

  date.setDate(date.getDate() + day)

  return new Date(date)
}
