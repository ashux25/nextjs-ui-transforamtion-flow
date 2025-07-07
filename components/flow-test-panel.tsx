"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FlowTestPanelProps {
  onAddTestNodes: () => void
  nodeCount: number
  edgeCount: number
}

export default function FlowTestPanel({ onAddTestNodes, nodeCount, edgeCount }: FlowTestPanelProps) {
  // 🔄 counts how many times this component rendered (no state update, no loops)
  const renderCountRef = React.useRef(0)
  renderCountRef.current += 1

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Flow Testing Panel
          <div className="flex gap-2">
            <Badge variant="outline">Nodes: {nodeCount}</Badge>
            <Badge variant="outline">Edges: {edgeCount}</Badge>
            <Badge variant="outline">Renders: {renderCountRef.current}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={onAddTestNodes} variant="outline">
            Add Test Flow (5 nodes)
          </Button>
          <Button
            onClick={() => {
              console.clear()
              console.log("🧹 Console cleared - starting fresh test")
            }}
            variant="outline"
          >
            Clear Console
          </Button>
          <div className="text-sm text-gray-600 flex items-center">
            Open browser console to monitor for recursion issues
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
