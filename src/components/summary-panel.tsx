import { PersonTotal } from "@/lib/calculate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface SummaryPanelProps {
  totals: PersonTotal[]
}

export function SummaryPanel({ totals }: SummaryPanelProps) {
  const grandTotal = totals.reduce((sum, t) => sum + t.total, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>who owes what</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {totals.length === 0 && (
          <p className="text-sm text-muted-foreground">add people and items to see the split</p>
        )}
        {totals.map((t) => (
          <div key={t.id} className="flex items-center justify-between text-sm">
            <span>{t.name}</span>
            <span className="font-semibold">${t.total.toFixed(2)}</span>
          </div>
        ))}
        {totals.length > 0 && (
          <>
            <Separator />
                                    <div className="flex items-center justify-between font-semibold">
              <span>total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}