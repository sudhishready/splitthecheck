"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users, Receipt, Percent, HandCoins } from "lucide-react"

interface GuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps = [
  {
    icon: Users,
    title: "Add Everyone",
    text: "Type in the names of everyone splitting the bill and hit add",
  },
  {
    icon: Receipt,
    title: "Add the Items",
    text: "Add what got ordered with the price, then tap who actually had it",
  },
  {
    icon: Percent,
    title: "Tax Tip Discount",
    text: "Put in the tax and tip percent, add a discount if you got one",
  },
  {
    icon: HandCoins,
    title: "Settle Up",
    text: "Scroll down and it shows exactly who owes who and how much",
  },
]
export function GuideModal({ open, onOpenChange }: GuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How Splitthecheck Works</DialogTitle>
          <DialogDescription>
            4 steps and youre done, no math needed
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {i + 1}. {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => onOpenChange(false)} className="w-full">
          Got It
        </Button>
      </DialogContent>
    </Dialog>
  )
}
