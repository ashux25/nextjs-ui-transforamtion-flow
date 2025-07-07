"use client"

import { useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Copy, Trash2, Edit } from "lucide-react"

interface NodeContextMenuProps {
  x: number
  y: number
  nodeId: string
  onClose: () => void
  onDelete: (nodeId: string) => void
  onDuplicate: (nodeId: string) => void
  onEdit: (nodeId: string) => void
}

export default function NodeContextMenu({
  x,
  y,
  nodeId,
  onClose,
  onDelete,
  onDuplicate,
  onEdit,
}: NodeContextMenuProps) {
  const handleAction = useCallback(
    (action: () => void) => {
      action()
      onClose()
    },
    [onClose],
  )

  return (
    <div className="fixed z-50" style={{ left: x, top: y }} onMouseLeave={onClose}>
      <Card className="w-48 shadow-lg border">
        <CardContent className="p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction(() => onEdit(nodeId))}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Properties
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction(() => onDuplicate(nodeId))}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Separator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleAction(() => onDelete(nodeId))}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
