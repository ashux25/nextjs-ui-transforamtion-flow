"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"

export default function SequentialNode({ data, selected }: NodeProps) {
  return (
    <Card
      className={`min-w-[180px] ${selected ? "ring-2 ring-blue-500" : ""} bg-blue-50 border-blue-200 hover:shadow-md transition-shadow`}
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
            <Play className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
          </div>
          <Badge className="bg-blue-100 text-blue-800">Sequential</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pointer-events-none">
        <div className="text-xs text-gray-600">ID: {data.task?.id || data.id}</div>
        {data.task?.responseKey && <div className="text-xs text-gray-600 mt-1">Key: {data.task.responseKey}</div>}
        {data.task?.tasks && <div className="text-xs text-gray-600 mt-1">Tasks: {data.task.tasks.length}</div>}
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </Card>
  )
}
