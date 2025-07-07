"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutGrid, Shuffle } from "lucide-react"

interface LayoutOptimizerProps {
  onOptimizeLayout: () => void
  onRandomizeLayout: () => void
}

export default function LayoutOptimizer({ onOptimizeLayout, onRandomizeLayout }: LayoutOptimizerProps) {
  return (
    <Card className="w-64 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Layout Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={onOptimizeLayout} variant="outline" size="sm" className="w-full bg-transparent">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Optimize Layout
        </Button>
        <Button onClick={onRandomizeLayout} variant="outline" size="sm" className="w-full bg-transparent">
          <Shuffle className="h-4 w-4 mr-2" />
          Randomize Positions
        </Button>
        <div className="text-xs text-gray-500 mt-2">
          Use these tools to automatically arrange nodes for better visibility
        </div>
      </CardContent>
    </Card>
  )
}
