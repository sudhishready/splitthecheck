import { Item, Person } from "./types"

export interface PersonTotal {
  id: string
  name: string
  subtotal: number
  tax: number
  tip: number
  discount: number
  total: number
}
export function calculateTotals(
  people: Person[],
  items: Item[],
  taxPercent: number,
  tipPercent: number,
  discountPercent: number,
): PersonTotal[] {
  const subtotals: Record<string, number> = {}

  for (const person of people) {
    subtotals[person.id] = 0
  }

  for (const item of items) {
    if (item.peopleIds.length === 0) continue
    const share = (item.price * (item.qty || 1)) / item.peopleIds.length
    for (const personId of item.peopleIds) {
      subtotals[personId] = (subtotals[personId] || 0) + share
    }
  }

  const billSubtotal = items.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0,
  )

  return people.map((person) => {
    const subtotal = subtotals[person.id] || 0
    const ratio = billSubtotal > 0 ? subtotal / billSubtotal : 0
    const tax = billSubtotal * (taxPercent / 100) * ratio
    const tip = billSubtotal * (tipPercent / 100) * ratio
    const discount = billSubtotal * (discountPercent / 100) * ratio
    return {
      id: person.id,
      name: person.name,
      subtotal,
      tax,
      tip,
      discount,
      total: subtotal + tax + tip - discount,
    }
  })
}

export interface Settlement {
  from: string
  to: string
  amount: number
}

export function calculateSettlements(
  people: Person[],
  items: Item[],
  taxPercent: number,
  discountPercent: number,
  tipPercent: number,
): Settlement[] {
  const totals = calculateTotals(
    people,
    items,
    taxPercent,
    tipPercent,
    discountPercent,
  )

  const owed: Record<string, number> = {}
  for (const t of totals) {
    owed[t.id] = t.total
  }

  const paid: Record<string, number> = {}
  for (const person of people) {
    paid[person.id] = 0
  }

  const billSubtotal = items.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0,
  )
  const billTotal = totals.reduce((sum, t) => sum + t.total, 0)
  const scale = billSubtotal > 0 ? billTotal / billSubtotal : 1
  for (const item of items) {
    if (!item.paidBy) continue
    paid[item.paidBy] =
      (paid[item.paidBy] || 0) + item.price * (item.qty || 1) * scale
  }

  const net = people.map((person) => ({
    id: person.id,
    name: person.name,
    balance: (paid[person.id] || 0) - (owed[person.id] || 0),
  }))

  const creditors = net
    .filter((n) => n.balance > 0.01)
    .sort((a, b) => b.balance - a.balance)
  const debtors = net
    .filter((n) => n.balance < -0.01)
    .sort((a, b) => a.balance - b.balance)

  const settlements: Settlement[] = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const amount = Math.min(-debtor.balance, creditor.balance)
    if (amount > 0.01) {
      settlements.push({ from: debtor.name, to: creditor.name, amount })
    }
    debtor.balance += amount
    creditor.balance -= amount
    if (Math.abs(debtor.balance) < 0.01) i++
    if (Math.abs(creditor.balance) < 0.01) j++
  }

  return settlements
}
