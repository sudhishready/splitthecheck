"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Person } from "@/lib/types"
import { X } from "lucide-react"
import { personColor } from "@/lib/utils"

interface PeoplePanelProps {
  people: Person[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
}

export function PeoplePanel({ people, onAdd, onRemove }: PeoplePanelProps) {
  const [name, setName] = useState("")

  function handleAdd() {
    if (!name.trim()) return
    onAdd(name.trim())
    setName("")
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="add a person"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {people.map((person, i) => (
          <Badge
            key={person.id}
            variant="secondary"
            className="gap-1 py-1 px-3 text-sm"
          >
            <span className={`h-2 w-2 rounded-full ${personColor(i)}`} />
            {person.name}
            <button
              onClick={() => onRemove(person.id)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
