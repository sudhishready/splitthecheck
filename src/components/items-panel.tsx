"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item, Person } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface ItemsPanelProps {
  items: Item[]
  people: Person[]
  onAdd: (name: string, price: number) => void
  onRemove: (id: string) => void
  onToggle: (itemId: string, personId: string) => void
}

export function ItemsPanel({ items, people, onAdd, onRemove, onToggle }: ItemsPanelProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  function handleAdd() {
    const value = parseFloat(price)
    if (!name.trim() || isNaN(value) || value <= 0) return
    onAdd(name.trim(), value)
    setName("")
    setPrice("")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24"
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">${item.price.toFixed(2)}</span>
                <button onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {people.map((person) => {
                const active = item.peopleIds.includes(person.id)
                return (
                  <button
                    key={person.id}
                    onClick={() => onToggle(item.id, person.id)}
                    className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {person.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}