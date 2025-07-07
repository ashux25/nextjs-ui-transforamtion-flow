"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  PlusCircle,
  Workflow,
  GitBranch,
  Database,
  Filter,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface NodeToolbarProps {
  onAddNode: (nodeType: string) => void
}

const nodeTypes = [
  {
    type: "STAGE",
    label: "Stage",
    icon: Workflow,
    description: "Workflow stage container",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    type: "API_CALL",
    label: "API Call",
    icon: Database,
    description: "External API request",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    type: "TRANSFORMATION",
    label: "Transform",
    icon: Filter,
    description: "Data transformation",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    type: "SEQUENTIAL",
    label: "Sequential",
    icon: Play,
    description: "Sequential task group",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    type: "PARALLEL",
    label: "Parallel",
    icon: Square,
    description: "Parallel task group",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    type: "CONDITION",
    label: "Condition",
    icon: GitBranch,
    description: "Decision point",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
]

export default function NodeToolbar({ onAddNode }: NodeToolbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log("🎯 Drag started for:", nodeType)
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleNodeClick = (nodeType: string) => {
    console.log("🖱️ Node clicked from toolbar:", nodeType)
    onAddNode(nodeType)
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r flex flex-col items-center py-4">
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(false)} className="mb-4">
          <ChevronRight className="h-4 w-4" />
        </Button>
        {nodeTypes.slice(0, 3).map((nodeType) => {
          const Icon = nodeType.icon
          return (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
              className="mb-2 p-2 cursor-grab hover:bg-gray-100 rounded active:cursor-grabbing"
              title={nodeType.label}
            >
              <Icon className="h-4 w-4" />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-r">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Nodes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(true)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">Drag nodes from here to the canvas to add them</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Flow Control</h4>
            <div className="space-y-2">
              {nodeTypes
                .filter((n) => ["STAGE", "CONDITION"].includes(n.type))
                .map((nodeType) => {
                  const Icon = nodeType.icon
                  return (
                    <div
                      key={nodeType.type}
                      draggable
                      onDragStart={(event) => onDragStart(event, nodeType.type)}
                      onClick={() => handleNodeClick(nodeType.type)}
                      className="w-full p-3 border rounded-md hover:bg-gray-50 bg-transparent cursor-grab active:cursor-grabbing transition-colors select-none"
                    >
                      <div className="flex items-center gap-3 w-full pointer-events-none">
                        <div className={`p-2 rounded-md ${nodeType.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">{nodeType.label}</div>
                          <div className="text-xs text-gray-500">{nodeType.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Tasks</h4>
            <div className="space-y-2">
              {nodeTypes
                .filter((n) => ["API_CALL", "TRANSFORMATION"].includes(n.type))
                .map((nodeType) => {
                  const Icon = nodeType.icon
                  return (
                    <div
                      key={nodeType.type}
                      draggable
                      onDragStart={(event) => onDragStart(event, nodeType.type)}
                      onClick={() => handleNodeClick(nodeType.type)}
                      className="w-full p-3 border rounded-md hover:bg-gray-50 bg-transparent cursor-grab active:cursor-grabbing transition-colors select-none"
                    >
                      <div className="flex items-center gap-3 w-full pointer-events-none">
                        <div className={`p-2 rounded-md ${nodeType.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">{nodeType.label}</div>
                          <div className="text-xs text-gray-500">{nodeType.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Task Groups</h4>
            <div className="space-y-2">
              {nodeTypes
                .filter((n) => ["SEQUENTIAL", "PARALLEL"].includes(n.type))
                .map((nodeType) => {
                  const Icon = nodeType.icon
                  return (
                    <div
                      key={nodeType.type}
                      draggable
                      onDragStart={(event) => onDragStart(event, nodeType.type)}
                      onClick={() => handleNodeClick(nodeType.type)}
                      className="w-full p-3 border rounded-md hover:bg-gray-50 bg-transparent cursor-grab active:cursor-grabbing transition-colors select-none"
                    >
                      <div className="flex items-center gap-3 w-full pointer-events-none">
                        <div className={`p-2 rounded-md ${nodeType.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">{nodeType.label}</div>
                          <div className="text-xs text-gray-500">{nodeType.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
