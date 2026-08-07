import { Settlement } from "@/lib/calculate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface SettleUpPanelProps {
  settlements: Settlement[]
}

export function SettleUpPanel({ settlements }: SettleUpPanelProps) {
  if (settlements.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>settle up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {settlements.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="font-medium">{s.from}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{s.to}</span>
            <span className="ml-auto font-semibold">
              ${s.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
