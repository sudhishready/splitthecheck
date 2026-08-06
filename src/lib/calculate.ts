import { Item, Person } from "./types"

export interface PersonTotal {
  id: string
  name: string
  subtotal: number
  tax: number
  tip: number
  total: number
}
export function calculateTotals(
  people: Person[],
  items: Item[],
  taxPercent: number,
  tipPercent: number
): PersonTotal[] {
  const subtotals: Record<string, number> = {}

  for (const person of people) {
    subtotals[person.id] = 0
  }

  for (const item of items) {
    if (item.peopleIds.length === 0) continue
    const share = item.price / item.peopleIds.length
    for (const personId of item.peopleIds) {
      subtotals[personId] = (subtotals[personId] || 0) + share
    }
  }

  const billSubtotal = items.reduce((sum, item) => sum + item.price, 0)

  return people.map((person) => {
    const subtotal = subtotals[person.id] || 0
    const ratio = billSubtotal > 0 ? subtotal / billSubtotal : 0
    const tax = billSubtotal * (taxPercent / 100) * ratio
    const tip = billSubtotal * (tipPercent / 100) * ratio
    return {
      id: person.id,
      name: person.name,
      subtotal,
      tax,
      tip,
      total: subtotal + tax + tip,
    }
  })
}