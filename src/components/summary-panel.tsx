"use client"

import { useState } from "react"
import { PersonTotal } from "@/lib/calculate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Copy, Check } from "lucide-react"

interface SummaryPanelProps {
  totals: PersonTotal[]
  billName: string
}

export function SummaryPanel({ totals, billName }: SummaryPanelProps) {
  const grandTotal = totals.reduce((sum, t) => sum + t.total, 0)
  const [copied, setCopied] = useState(false)
  function copySummary() {
    const lines = totals.map((t) => `${t.name}: $${t.total.toFixed(2)}`)
    if (billName) lines.unshift(billName)
    lines.push(`Total: $${grandTotal.toFixed(2)}`)
    navigator.clipboard.writeText(lines.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Who Owes What</CardTitle>
        {totals.length > 0 && (
          <button
            onClick={copySummary}
            className="text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {totals.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add people and items to see the split
          </p>
        )}
        {totals.map((t) => (
          <div key={t.id} className="space-y-0.5 text-sm">
            <div className="flex items-center justify-between">
              <span>{t.name}</span>
              <span className="font-semibold">${t.total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Sub {t.subtotal.toFixed(2)} + Tax {t.tax.toFixed(2)} + Tip{" "}
              {t.tip.toFixed(2)} - Disc {t.discount.toFixed(2)}
            </p>
          </div>
        ))}
        {totals.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>
                $<NumberTicker value={grandTotal} decimalPlaces={2} />
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
