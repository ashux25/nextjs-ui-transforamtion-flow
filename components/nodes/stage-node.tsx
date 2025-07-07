"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StageNode({ data, selected }: NodeProps) {
  return (
    <Card
      className={`min-w-[200px] ${selected ? "ring-2 ring-blue-500" : ""} hover:shadow-md transition-shadow`}
      style={{ cursor: "grab" }}
      onMouseDown={(e) => {
        // Allow dragging by not preventing default
        e.currentTarget.style.cursor = "grabbing"
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = "grab"
      }}
    >
      <CardHeader className="pb-2 pointer-events-none">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
          <Badge variant="secondary">Stage</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pointer-events-none">
        <div className="text-xs text-gray-600">ID: {data.stage?.id}</div>
        {data.stage?.postTransformationId && (
          <div className="text-xs text-gray-600 mt-1">Transform: {data.stage.postTransformationId.slice(-8)}...</div>
        )}
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </Card>
  )
}
