"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item, Person } from "@/lib/types"
import { Trash2, Pencil } from "lucide-react"

interface ItemsPanelProps {
  items: Item[]
  people: Person[]
  onAdd: (name: string, price: number) => void
  onRemove: (id: string) => void
  onToggle: (itemId: string, personId: string) => void
  onSetPayer: (itemId: string, personId: string) => void
  onSetQty: (itemId: string, qty: number) => void
  onEdit: (itemId: string, name: string, price: number) => void
  onSelectAll: (itemId: string, ids: string[]) => void
}

export function ItemsPanel({
  items,
  people,
  onSetQty,
  onAdd,
  onRemove,
  onToggle,
  onSetPayer,
  onSelectAll,
  onEdit,
}: ItemsPanelProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState("")
  function startEdit(item: Item) {
    setEditingId(item.id)
    setEditName(item.name)
    setEditPrice(String(item.price))
  }

  function saveEdit(id: string) {
    const value = parseFloat(editPrice)
    if (!editName.trim() || isNaN(value) || value <= 0) return
    onEdit(id, editName.trim(), value)
    setEditingId(null)
  }

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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      onSetQty(item.id, Math.max(1, (item.qty || 1) - 1))
                    }
                    className="text-muted-foreground hover:text-foreground px-1"
                  >
                    -
                  </button>
                  <span className="text-xs w-4 text-center">
                    {item.qty || 1}
                  </span>
                  <button
                    onClick={() => onSetQty(item.id, (item.qty || 1) + 1)}
                    className="text-muted-foreground hover:text-foreground px-1"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  ${(item.price * (item.qty || 1)).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
            {editingId === item.id && (
              <div className="flex gap-2 pt-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8"
                />
                <Input
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="h-8 w-20"
                />
                <Button size="sm" onClick={() => saveEdit(item.id)}>
                  save
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  onSelectAll(
                    item.id,
                    item.peopleIds.length === people.length
                      ? []
                      : people.map((p) => p.id),
                  )
                }
                className="text-xs rounded-full px-3 py-1 border border-dashed border-muted-foreground/40 text-muted-foreground"
              >
                all
              </button>
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
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">paid by</span>
              {people.map((person) => {
                const isPayer = item.paidBy === person.id
                return (
                  <button
                    key={person.id}
                    onClick={() => onSetPayer(item.id, person.id)}
                    className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                      isPayer
                        ? "bg-emerald-600 text-white border-emerald-600"
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
