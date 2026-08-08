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
import {
  RotateCcw,
  HelpCircle,
  Users,
  Receipt,
  ShoppingBag,
  PieChart,
  HandCoins,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GuideModal } from "@/components/guide-modal"
const STORAGE_KEY = "splitthecheck-data"

export default function Home() {
  const [guideOpen, setGuideOpen] = useState(false)
  const [people, setPeople] = useState<Person[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [taxPercent, setTaxPercent] = useState(0)
  const [billName, setBillName] = useState("")
  const [tipPercent, setTipPercent] = useState(0)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [paidSettlements, setPaidSettlements] = useState<string[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      setPeople(data.people || [])
      setItems(data.items || [])
      setBillName(data.billName || "")
      setTaxPercent(data.taxPercent || 0)
      setTipPercent(data.tipPercent || 0)
      setDiscountPercent(data.discountPercent || 0)
      setPaidSettlements(data.paidSettlements || [])
    }
    setLoaded(true)
  }, [])
  useEffect(() => {
    const seen = localStorage.getItem("splitthecheck-guide-seen")
    if (!seen) {
      setGuideOpen(true)
      localStorage.setItem("splitthecheck-guide-seen", "1")
    }
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        people,
        billName,
        items,
        taxPercent,
        tipPercent,
        discountPercent,
        paidSettlements,
      }),
    )
  }, [
    people,
    billName,
    items,
    taxPercent,
    tipPercent,
    discountPercent,
    paidSettlements,
    loaded,
  ])

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

  function editItem(itemId: string, name: string, price: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, name, price } : item,
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
  function toggleSettlementPaid(key: string) {
    setPaidSettlements((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }
  function resetAll() {
    if (!confirm("wipe everything and start a new bill?")) return
    setPeople([])
    setItems([])
    setTaxPercent(0)
    setPaidSettlements([])
    setTipPercent(0)
    setDiscountPercent(0)
    setBillName("")
  }

  const totals = calculateTotals(
    people,
    items,
    taxPercent,
    tipPercent,
    discountPercent,
  )
  const settlements = calculateSettlements(
    people,
    items,
    taxPercent,
    discountPercent,
    tipPercent,
  )

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <GuideModal open={guideOpen} onOpenChange={setGuideOpen} />
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex justify-end gap-2">
          <button
            onClick={resetAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setGuideOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <AnimatedThemeToggler />
        </div>
        <div className="text-center space-y-3">
          <AnimatedGradientText className="text-4xl font-bold">
            Splitthecheck
          </AnimatedGradientText>
          <p className="text-muted-foreground">
            Split the bill without doing the math in your head
          </p>
          <Input
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
            placeholder="Name this bill (optional)"
            className="max-w-xs mx-auto text-center"
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="h-4 w-4" />
              Bill Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax">Tax %</Label>
                <Input
                  id="tax"
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tip">Tip %</Label>
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
              <div className="space-y-2">
                <Label htmlFor="discount">Discount %</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Who's Splitting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PeoplePanel
              people={people}
              onAdd={addPerson}
              onRemove={removePerson}
              totals={totals}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="h-4 w-4" />
              The Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemsPanel
              items={items}
              people={people}
              onAdd={addItem}
              onRemove={removeItem}
              onToggle={toggleItemPerson}
              onSetPayer={setItemPayer}
              onSetQty={setItemQty}
              onEdit={editItem}
              onSelectAll={setItemAllPeople}
            />
          </CardContent>
        </Card>
        <SummaryPanel totals={totals} billName={billName} />
        <SettleUpPanel
          settlements={settlements}
          paidKeys={paidSettlements}
          onTogglePaid={toggleSettlementPaid}
        />
      </div>
    </main>
  )
}
