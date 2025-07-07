"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch } from "lucide-react"

export default function ConditionNode({ data, selected }: NodeProps) {
  return (
    <Card
      className={`min-w-[160px] ${selected ? "ring-2 ring-blue-500" : ""} bg-yellow-50 border-yellow-200 hover:shadow-md transition-shadow`}
      style={{ cursor: "grab" }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = "grabbing"
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = "grab"
      }}
    >
      <CardHeader className="pb-2 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800">Choice</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pointer-events-none">
        {data.condition?.conditions && (
          <div className="text-xs text-gray-600">Conditions: {data.condition.conditions.length}</div>
        )}
        {data.condition?.defaultStage && (
          <div className="text-xs text-gray-600 mt-1">Default: {data.condition.defaultStage}</div>
        )}
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-yellow-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-yellow-500" />
    </Card>
  )
}
