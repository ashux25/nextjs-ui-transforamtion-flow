"use client"

import { useState } from "react"
import type { Node } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface NodePropertiesPanelProps {
  node: Node
  onUpdate: (nodeId: string, updatedData: any) => void
  onClose: () => void
}

export default function NodePropertiesPanel({ node, onUpdate, onClose }: NodePropertiesPanelProps) {
  const [formData, setFormData] = useState({
    name: node.data.label || "",
    type: node.data.type || "",
    responseKey: node.data.task?.responseKey || "",
    endpointId: node.data.task?.endpointId || "",
    transformationId: node.data.task?.transformationId || "",
    expression: node.data.condition?.conditions?.[0]?.condition?.expression || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const updatedData = {
      label: formData.name,
      type: formData.type,
    }

    if (node.data.task) {
      updatedData.task = {
        ...node.data.task,
        name: formData.name,
        responseKey: formData.responseKey,
        endpointId: formData.endpointId,
        transformationId: formData.transformationId,
      }
    }

    if (node.data.stage) {
      updatedData.stage = {
        ...node.data.stage,
        name: formData.name,
      }
    }

    if (node.data.condition) {
      updatedData.condition = {
        ...node.data.condition,
        conditions:
          node.data.condition.conditions?.map((cond: any, index: number) =>
            index === 0
              ? {
                  ...cond,
                  condition: {
                    ...cond.condition,
                    expression: formData.expression,
                  },
                }
              : cond,
          ) || [],
      }
    }

    onUpdate(node.id, updatedData)
  }

  return (
    <Card className="h-full rounded-none border-0 border-l">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Node Properties</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter node name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="API_CALL">API Call</SelectItem>
              <SelectItem value="TRANSFORMATION">Transformation</SelectItem>
              <SelectItem value="SEQUENTIAL">Sequential</SelectItem>
              <SelectItem value="PARALLEL">Parallel</SelectItem>
              <SelectItem value="STAGE">Stage</SelectItem>
              <SelectItem value="CONDITION">Condition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {node.data.task && (
          <>
            <div className="space-y-2">
              <Label htmlFor="responseKey">Response Key</Label>
              <Input
                id="responseKey"
                value={formData.responseKey}
                onChange={(e) => handleInputChange("responseKey", e.target.value)}
                placeholder="Enter response key"
              />
            </div>

            {formData.type === "API_CALL" && (
              <div className="space-y-2">
                <Label htmlFor="endpointId">Endpoint ID</Label>
                <Input
                  id="endpointId"
                  value={formData.endpointId}
                  onChange={(e) => handleInputChange("endpointId", e.target.value)}
                  placeholder="Enter endpoint ID"
                />
              </div>
            )}

            {formData.type === "TRANSFORMATION" && (
              <div className="space-y-2">
                <Label htmlFor="transformationId">Transformation ID</Label>
                <Input
                  id="transformationId"
                  value={formData.transformationId}
                  onChange={(e) => handleInputChange("transformationId", e.target.value)}
                  placeholder="Enter transformation ID"
                />
              </div>
            )}
          </>
        )}

        {node.data.condition && (
          <div className="space-y-2">
            <Label htmlFor="expression">Condition Expression</Label>
            <Textarea
              id="expression"
              value={formData.expression}
              onChange={(e) => handleInputChange("expression", e.target.value)}
              placeholder="Enter condition expression"
              rows={3}
            />
          </div>
        )}

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Node Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>ID: {node.id}</div>
            <div>
              Position: ({Math.round(node.position.x)}, {Math.round(node.position.y)})
            </div>
            <div>Selected: {node.selected ? "Yes" : "No"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
