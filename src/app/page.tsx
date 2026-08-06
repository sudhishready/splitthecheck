"use client"

import { useEffect, useState } from "react"
import { Person, Item } from "@/lib/types"
import { calculateTotals } from "@/lib/calculate"
import { PeoplePanel } from "@/components/people-panel"
import { ItemsPanel } from "@/components/items-panel"
import { SummaryPanel } from "@/components/summary-panel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"

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
      JSON.stringify({ people, items, taxPercent, tipPercent })
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
      }))
    )
  }

  function addItem(name: string, price: number) {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, price, peopleIds: [] },
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
      })
    )
  }