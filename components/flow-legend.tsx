"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FlowLegend() {
  const connectionTypes = [
    { color: "#3B82F6", label: "Stage Connections", description: "From stages to tasks" },
    { color: "#8B5CF6", label: "Task Chains", description: "Between API calls and transformations" },
    { color: "#06B6D4", label: "Sequential Flow", description: "From sequential groups" },
    { color: "#F97316", label: "Parallel Flow", description: "From parallel groups" },
    { color: "#EF4444", label: "Condition Flow", description: "From decision points" },
    { color: "#10B981", label: "True Condition", description: "When condition is met" },
    { color: "#F59E0B", label: "Default Path", description: "Fallback route" },
    { color: "#6B7280", label: "Other Connections", description: "General connections" },
  ]

  return (
    <Card className="w-64 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Connection Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {connectionTypes.map((type, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: type.color }} />
            <div className="flex-1">
              <div className="text-xs font-medium">{type.label}</div>
              <div className="text-xs text-gray-500">{type.description}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
