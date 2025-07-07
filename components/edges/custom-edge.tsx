"use client"

import { getBezierPath, EdgeLabelRenderer, BaseEdge, type EdgeProps } from "reactflow"

const getEdgeColor = (sourceNodeType?: string, targetNodeType?: string, label?: string) => {
  // Condition node edges
  if (label === "true") return "#10B981" // Green for true conditions
  if (label === "default") return "#F59E0B" // Orange for default conditions

  // Stage to task connections
  if (sourceNodeType === "STAGE") return "#3B82F6" // Blue for stage connections

  // Task to task connections
  if (sourceNodeType === "task" && targetNodeType === "task") return "#8B5CF6" // Purple for task chains

  // Sequential group connections
  if (sourceNodeType === "sequential" || targetNodeType === "sequential") return "#06B6D4" // Cyan for sequential

  // Parallel group connections
  if (sourceNodeType === "parallel" || targetNodeType === "parallel") return "#F97316" // Orange for parallel

  // Condition node connections
  if (sourceNodeType === "condition" || targetNodeType === "condition") return "#EF4444" // Red for conditions

  // Default color
  return "#6B7280" // Gray for others
}

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style = {},
  markerEnd,
  source,
  target,
  sourceHandleId,
  targetHandleId,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  // Get edge color based on connection type
  const edgeColor = getEdgeColor(data?.sourceType, data?.targetType, label)

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 2,
          stroke: edgeColor,
          ...style,
        }}
        markerEnd={
          markerEnd
            ? {
                ...markerEnd,
                color: edgeColor,
              }
            : undefined
        }
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 11,
              fontWeight: 500,
              pointerEvents: "none",
              padding: "2px 6px",
              background: label === "true" ? "#10B981" : label === "default" ? "#F59E0B" : "white",
              color: label === "true" || label === "default" ? "white" : "#374151",
              border: label === "true" || label === "default" ? "none" : "1px solid #E5E7EB",
              borderRadius: 4,
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
