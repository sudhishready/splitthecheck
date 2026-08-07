import { Settlement } from "@/lib/calculate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Check } from "lucide-react"

interface SettleUpPanelProps {
  settlements: Settlement[]
  paidKeys: string[]
  onTogglePaid: (key: string) => void
}

export function SettleUpPanel({
  settlements,
  paidKeys,
  onTogglePaid,
}: SettleUpPanelProps) {
  if (settlements.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>settle up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {settlements.map((s, i) => {
          const key = `${s.from}-${s.to}-${i}`
          const paid = paidKeys.includes(key)
          return (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm ${paid ? "opacity-40 line-through" : ""}`}
            >
              <button
                onClick={() => onTogglePaid(key)}
                className="h-4 w-4 rounded border border-muted-foreground/40 flex items-center justify-center shrink-0"
              >
                {paid && <Check className="h-3 w-3" />}
              </button>
              <span className="font-medium">{s.from}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{s.to}</span>
              <span className="ml-auto font-semibold">
                ${s.amount.toFixed(2)}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
