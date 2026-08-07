"use client"

import { useEffect, useState } from "react"
import { Person, Item } from "@/lib/types"
import { calculateTotals, calculateSettlements } from "@/lib/calculate"
import { PeoplePanel } from "@/components/people-panel"
import { ItemsPanel } from "@/components/items-panel"
import { SummaryPanel } from "@/components/summary-panel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { SettleUpPanel } from "@/components/settle-up-panel"
import { RotateCcw } from "lucide-react"

const STORAGE_KEY = "splitthecheck-data"

export default function Home() {
  const [people, setPeople] = useState<Person[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [taxPercent, setTaxPercent] = useState(0)
  const [tipPercent, setTipPercent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      setPeople(data.people || [])
      setItems(data.items || [])
      setTaxPercent(data.taxPercent || 0)
      setTipPercent(data.tipPercent || 0)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ people, items, taxPercent, tipPercent }),
    )
  }, [people, items, taxPercent, tipPercent, loaded])

  function addPerson(name: string) {
    setPeople((prev) => [...prev, { id: crypto.randomUUID(), name }])
  }

  function removePerson(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id))
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        peopleIds: item.peopleIds.filter((pid) => pid !== id),
      })),
    )
  }

  function addItem(name: string, price: number) {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, price, qty: 1, peopleIds: [] },
    ])
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function toggleItemPerson(itemId: string, personId: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item
        const has = item.peopleIds.includes(personId)
        return {
          ...item,
          peopleIds: has
            ? item.peopleIds.filter((id) => id !== personId)
            : [...item.peopleIds, personId],
        }
      }),
    )
  }
  function setItemPayer(itemId: string, personId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, paidBy: personId } : item,
      ),
    )
  }

  function setItemQty(itemId: string, qty: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, qty } : item)),
    )
  }
  function setItemAllPeople(itemId: string, ids: string[]) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, peopleIds: ids } : item,
      ),
    )
  }
  function resetAll() {
    if (!confirm("wipe everything and start a new bill?")) return
    setPeople([])
    setItems([])
    setTaxPercent(0)
    setTipPercent(0)
  }

  const totals = calculateTotals(people, items, taxPercent, tipPercent)
  const settlements = calculateSettlements(
    people,
    items,
    taxPercent,
    tipPercent,
  )

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex justify-end gap-2">
          <button
            onClick={resetAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <AnimatedThemeToggler />
        </div>
        <div className="text-center space-y-3">
          <AnimatedGradientText className="text-4xl font-bold">
            splitthecheck
          </AnimatedGradientText>
          <p className="text-muted-foreground">
            split the bill without doing the math in your head
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax">tax %</Label>
            <Input
              id="tax"
              type="number"
              value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tip">tip %</Label>
            <Input
              id="tip"
              type="number"
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value))}
            />
            <div className="flex gap-1 pt-1">
              {[0, 10, 15, 18, 20].map((p) => (
                <button
                  key={p}
                  onClick={() => setTipPercent(p)}
                  className={`text-xs rounded-full px-2 py-0.5 border ${
                    tipPercent === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <PeoplePanel
          people={people}
          onAdd={addPerson}
          onRemove={removePerson}
        />

        <ItemsPanel
          items={items}
          people={people}
          onAdd={addItem}
          onRemove={removeItem}
          onToggle={toggleItemPerson}
          onSetPayer={setItemPayer}
          onSetQty={setItemQty}
          onSelectAll={setItemAllPeople}
        />

        <SummaryPanel totals={totals} />

        <SettleUpPanel settlements={settlements} />
      </div>
    </main>
  )
}
