"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiIcon as ApiIcon, FilterIcon as TransformIcon } from "lucide-react"

export default function TaskNode({ data, selected }: NodeProps) {
  const getIcon = () => {
    switch (data.type) {
      case "API_CALL":
        return <ApiIcon className="w-4 h-4" />
      case "TRANSFORMATION":
        return <TransformIcon className="w-4 h-4" />
      default:
        return null
    }
  }

  const getBadgeColor = () => {
    switch (data.type) {
      case "API_CALL":
        return "bg-green-100 text-green-800"
      case "TRANSFORMATION":
        return "bg-purple-100 text-purple-800"
      case "SEQUENTIAL":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card
      className={`min-w-[180px] ${selected ? "ring-2 ring-blue-500" : ""} hover:shadow-md transition-shadow`}
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
            {getIcon()}
            <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
          </div>
          <Badge className={getBadgeColor()}>{data.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pointer-events-none">
        <div className="text-xs text-gray-600">ID: {data.task?.id}</div>
        {data.task?.responseKey && <div className="text-xs text-gray-600 mt-1">Key: {data.task.responseKey}</div>}
        {data.task?.endpointId && (
          <div className="text-xs text-gray-600 mt-1">Endpoint: {data.task.endpointId.slice(-8)}...</div>
        )}
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500" />
    </Card>
  )
}
