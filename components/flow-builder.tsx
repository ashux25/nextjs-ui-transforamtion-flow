"use client"

import type React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type NodeTypes,
  type EdgeTypes,
  type Node,
  type NodeDragHandler,
  type Connection,
  type ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"
import useSuppressResizeObserverError from "@/hooks/use-suppress-resize-observer-error"

import StageNode from "./nodes/stage-node"
import TaskNode from "./nodes/task-node"
import ConditionNode from "./nodes/condition-node"
import CustomEdge from "./edges/custom-edge"
import ParallelNode from "./nodes/parallel-node"
import NodeToolbar from "./node-toolbar"
import NodePropertiesPanel from "./node-properties-panel"
import { convertJsonToNodes, convertNodesToJson, type FlowData } from "../utils/flow-converter"
import SequentialNode from "./nodes/sequential-node"

const nodeTypes: NodeTypes = {
  stage: StageNode,
  task: TaskNode,
  condition: ConditionNode,
  api_call: TaskNode,
  transformation: TaskNode,
  sequential: SequentialNode,
  parallel: ParallelNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const getEdgeColorForConnection = (sourceNode: Node, targetNode: Node) => {
  const sourceType = sourceNode.data.type
  const targetType = targetNode.data.type

  // Stage to task connections
  if (sourceType === "STAGE") return "#3B82F6" // Blue for stage connections

  // Task to task connections
  if (
    (sourceType === "API_CALL" || sourceType === "TRANSFORMATION") &&
    (targetType === "API_CALL" || targetType === "TRANSFORMATION")
  ) {
    return "#8B5CF6" // Purple for task chains
  }

  // Sequential group connections
  if (sourceType === "SEQUENTIAL") return "#06B6D4" // Cyan for sequential

  // Parallel group connections
  if (sourceType === "PARALLEL") return "#F97316" // Orange for parallel

  // Condition node connections
  if (sourceType === "CONDITION") return "#EF4444" // Red for conditions

  // Default color
  return "#6B7280" // Gray for others
}

interface FlowBuilderProps {
  flowData: FlowData
  onFlowUpdate: (updatedFlow: FlowData) => void
}

const FlowBuilder = ({ flowData, onFlowUpdate }: FlowBuilderProps) => {
  // Track if nodes have been initialized to prevent constant resets
  const nodesInitialized = useRef(false)
  const isDragging = useRef(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const lastFlowDataRef = useRef<string>("")

  // 🛑 Prevent harmless ResizeObserver console error from bubbling
  useSuppressResizeObserverError()

  console.log("🔄 FlowBuilder render", {
    hasComposition: !!flowData?.composition,
    stagesCount: flowData?.composition?.stages?.length || 0,
    nodesCount: flowData?.nodes?.length || 0,
  })

  // Convert JSON structure to ReactFlow nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    console.log("🔄 Converting JSON to nodes/edges")
    const result = convertJsonToNodes(flowData)
    console.log("📊 Conversion result:", { nodeCount: result.nodes.length, edgeCount: result.edges.length })
    return result
  }, [flowData])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)

  // Reset nodes and edges when flowData changes significantly
  useEffect(() => {
    const currentFlowDataString = JSON.stringify(flowData)

    if (currentFlowDataString !== lastFlowDataRef.current) {
      console.log("🔄 FlowData changed, updating nodes and edges")
      lastFlowDataRef.current = currentFlowDataString

      const { nodes: newNodes, edges: newEdges } = convertJsonToNodes(flowData)
      setNodes(newNodes)
      setEdges(newEdges)
      nodesInitialized.current = true
    }
  }, [flowData, setNodes, setEdges])

  // Only notify parent when nodes or edges actually change
  const notifyParentOfChanges = useCallback(() => {
    console.log("📤 Notifying parent of changes", { nodesCount: nodes.length, edgesCount: edges.length })
    const updatedFlowData = convertNodesToJson(nodes, edges, flowData)
    onFlowUpdate(updatedFlowData)
  }, [nodes, edges, flowData, onFlowUpdate])

  // Handle node changes and notify parent
  const handleNodesChange = useCallback(
    (changes: any) => {
      console.log("🔧 Nodes changed", changes)
      onNodesChange(changes)

      // Only notify parent if not currently dragging
      if (!isDragging.current) {
        setTimeout(() => notifyParentOfChanges(), 0)
      }
    },
    [onNodesChange, notifyParentOfChanges],
  )

  // Handle edge changes and notify parent
  const handleEdgesChange = useCallback(
    (changes: any) => {
      console.log("🔗 Edges changed", changes)
      onEdgesChange(changes)
      setTimeout(() => notifyParentOfChanges(), 0)
    },
    [onEdgesChange, notifyParentOfChanges],
  )

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("🔌 New connection", params)

      // Find source and target nodes to determine edge color
      const sourceNode = nodes.find((n) => n.id === params.source)
      const targetNode = nodes.find((n) => n.id === params.target)

      if (sourceNode && targetNode) {
        const edgeColor = getEdgeColorForConnection(sourceNode, targetNode)

        const newEdge = {
          ...params,
          type: "custom",
          style: {
            stroke: edgeColor,
          },
          markerEnd: {
            type: "arrowclosed",
            color: edgeColor,
          },
          data: {
            sourceType: sourceNode.data.type,
            targetType: targetNode.data.type,
          },
        }

        setEdges((eds) => addEdge(newEdge, eds))
        setTimeout(() => notifyParentOfChanges(), 0)
      }
    },
    [nodes, setEdges, notifyParentOfChanges],
  )

  // Handle node drag start
  const onNodeDragStart: NodeDragHandler = useCallback((event, node) => {
    console.log("🚀 Node drag started:", node.id)
    isDragging.current = true
  }, [])

  // Handle node drag
  const onNodeDrag: NodeDragHandler = useCallback((event, node) => {
    // Reduced logging for performance
  }, [])

  // Handle node drag stop
  const onNodeDragStop: NodeDragHandler = useCallback(
    (event, node) => {
      console.log("🛑 Node drag stopped:", node.id, node.position)
      isDragging.current = false
      // Notify parent after drag stops
      setTimeout(() => notifyParentOfChanges(), 100)
    },
    [notifyParentOfChanges],
  )

  // Handle drag over for drop zone
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowInstance) {
        console.log("❌ ReactFlow instance not ready")
        return
      }

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const nodeType = event.dataTransfer.getData("application/reactflow")

      console.log("🎯 Drop detected:", { nodeType, reactFlowBounds })

      if (nodeType && reactFlowBounds) {
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        console.log("📍 Drop position:", position)

        const newNodeId = `${nodeType.toLowerCase()}_${Date.now()}`
        let visualNodeType = nodeType.toLowerCase()

        // Map node types to visual components
        if (["api_call", "transformation"].includes(visualNodeType)) {
          visualNodeType = "task"
        }

        const newNode: Node = {
          id: newNodeId,
          type: visualNodeType,
          position,
          data: {
            label: `New ${nodeType.replace("_", " ")}`,
            type: nodeType,
            ...(nodeType === "STAGE"
              ? {
                  stage: {
                    id: newNodeId,
                    name: `New ${nodeType}`,
                    tasks: [],
                  },
                }
              : nodeType === "CONDITION"
                ? {
                    condition: {
                      type: "CHOICE",
                      conditions: [],
                      defaultStage: "",
                    },
                  }
                : {
                    task: {
                      id: newNodeId,
                      name: `New ${nodeType.replace("_", " ")}`,
                      type: nodeType,
                      responseKey: `${newNodeId}_response`,
                    },
                  }),
          },
          draggable: true,
        }

        console.log("✅ Dropped new node:", newNode)
        setNodes((nds) => [...nds, newNode])
        setTimeout(() => notifyParentOfChanges(), 0)
      }
    },
    [reactFlowInstance, setNodes, notifyParentOfChanges],
  )

  const handleAddNode = useCallback(
    (nodeType: string) => {
      console.log("➕ Adding node type:", nodeType)

      // Find a good position for the new node (avoid overlaps)
      const existingPositions = nodes.map((n) => n.position)
      let newX = 200
      let newY = 200

      // Find an empty spot
      while (existingPositions.some((pos) => Math.abs(pos.x - newX) < 250 && Math.abs(pos.y - newY) < 150)) {
        newX += 300
        if (newX > 1200) {
          newX = 200
          newY += 200
        }
      }

      const newNodeId = `${nodeType.toLowerCase()}_${Date.now()}`
      let visualNodeType = nodeType.toLowerCase()

      // Map node types to visual components
      if (["api_call", "transformation"].includes(visualNodeType)) {
        visualNodeType = "task"
      }

      const newNode: Node = {
        id: newNodeId,
        type: visualNodeType,
        position: { x: newX, y: newY },
        data: {
          label: `New ${nodeType.replace("_", " ")}`,
          type: nodeType,
          ...(nodeType === "STAGE"
            ? {
                stage: {
                  id: newNodeId,
                  name: `New ${nodeType}`,
                  tasks: [],
                },
              }
            : nodeType === "CONDITION"
              ? {
                  condition: {
                    type: "CHOICE",
                    conditions: [],
                    defaultStage: "",
                  },
                }
              : {
                  task: {
                    id: newNodeId,
                    name: `New ${nodeType.replace("_", " ")}`,
                    type: nodeType,
                    responseKey: `${newNodeId}_response`,
                  },
                }),
        },
        draggable: true,
      }

      console.log("✅ Added new node:", newNode)
      setNodes((nds) => [...nds, newNode])
      setTimeout(() => notifyParentOfChanges(), 0)
    },
    [nodes, setNodes, notifyParentOfChanges],
  )

  const handleNodeClick = useCallback((event: any, node: Node) => {
    console.log("🖱️ Node clicked:", node.id)
    event.stopPropagation()
    setSelectedNode(node)
    setShowPropertiesPanel(true)
  }, [])

  const handleNodeUpdate = useCallback(
    (nodeId: string, updatedData: any) => {
      console.log("📝 Updating node:", nodeId, updatedData)
      setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: updatedData } : node)))
      setTimeout(() => notifyParentOfChanges(), 0)
    },
    [setNodes, notifyParentOfChanges],
  )

  const handleClosePropertiesPanel = useCallback(() => {
    setShowPropertiesPanel(false)
    setSelectedNode(null)
  }, [])

  return (
    <div className="flex h-full">
      <NodeToolbar onAddNode={handleAddNode} />
      <div className="flex-1 flex">
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView={true}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            preventScrolling={false}
            defaultEdgeOptions={{
              type: "custom",
            }}
          >
            <Controls />
            <Background color="#aaa" gap={16} />
            <svg>
              <defs>
                <marker
                  id="arrowclosed"
                  markerWidth="12"
                  markerHeight="12"
                  refX="10"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#6B7280" />
                </marker>
              </defs>
            </svg>
          </ReactFlow>
        </div>
        {showPropertiesPanel && selectedNode && (
          <div className="w-80">
            <NodePropertiesPanel node={selectedNode} onUpdate={handleNodeUpdate} onClose={handleClosePropertiesPanel} />
          </div>
        )}
      </div>
    </div>
  )
}

export default FlowBuilder
