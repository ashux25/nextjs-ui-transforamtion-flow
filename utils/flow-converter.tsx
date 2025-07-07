import type { Node, Edge } from "reactflow"

export interface FlowData {
  composition?: {
    stages?: Array<{
      id: string
      name: string
      postTransformationId?: string
      tasks?: Array<{
        id: string
        name: string
        type: string
        responseKey?: string
        endpointId?: string
        transformationId?: string
        tasks?: Array<any>
      }>
      nextStage?: {
        type: string
        defaultStage?: string
        conditions?: Array<{
          condition: {
            expression: string
            operator: string
            dataType: string
            value: any
          }
          stage: string
        }>
      }
    }>
    startStage?: string
  }
  nodes?: Node[]
  edges?: Edge[]
  [key: string]: any // Allow other properties
}

const getEdgeColor = (sourceType: string, targetType?: string, label?: string) => {
  // Condition node edges
  if (label === "true") return "#10B981" // Green for true conditions
  if (label === "default") return "#F59E0B" // Orange for default conditions

  // Stage to task connections
  if (sourceType === "STAGE") return "#3B82F6" // Blue for stage connections

  // Task to task connections
  if (sourceType === "API_CALL" || sourceType === "TRANSFORMATION") return "#8B5CF6" // Purple for task chains

  // Sequential group connections
  if (sourceType === "SEQUENTIAL") return "#06B6D4" // Cyan for sequential

  // Parallel group connections
  if (sourceType === "PARALLEL") return "#F97316" // Orange for parallel

  // Condition node connections
  if (sourceType === "CONDITION") return "#EF4444" // Red for conditions

  // Default color
  return "#6B7280" // Gray for others
}

const calculateNodePosition = (stageIndex: number, taskIndex: number, nestedIndex = 0, isNested = false) => {
  const STAGE_WIDTH = 300
  const TASK_WIDTH = 250
  const VERTICAL_SPACING = 180
  const HORIZONTAL_SPACING = 320
  const NESTED_OFFSET = 350

  let x = 100 // Start position
  let y = 100 + stageIndex * 400 // Vertical spacing between stages

  if (isNested) {
    x = 100 + STAGE_WIDTH + HORIZONTAL_SPACING + NESTED_OFFSET
    y = y + nestedIndex * VERTICAL_SPACING - 50
  } else if (taskIndex > 0) {
    x = 100 + STAGE_WIDTH + taskIndex * HORIZONTAL_SPACING
  }

  return { x, y }
}

export function convertJsonToNodes(flowData: FlowData): { nodes: Node[]; edges: Edge[] } {
  console.log("🔄 convertJsonToNodes called with:", flowData)

  const nodes: Node[] = []
  const edges: Edge[] = []

  // If we already have nodes and edges, use them (they might have user-modified positions)
  if (flowData.nodes && flowData.edges && flowData.nodes.length > 0) {
    console.log("📦 Using existing nodes and edges")
    return {
      nodes: flowData.nodes.map((node) => ({ ...node, draggable: true })),
      edges: flowData.edges.map((edge) => ({
        ...edge,
        type: "custom",
        markerEnd: {
          type: "arrowclosed",
          color: edge.style?.stroke || "#6B7280",
        },
      })),
    }
  }

  if (!flowData.composition?.stages) {
    console.log("❌ No composition stages found")
    return { nodes: [], edges: [] }
  }

  console.log("🏗️ Building nodes from composition stages")
  const stages = flowData.composition.stages
  const yOffset = 100

  // Helper function to create edges with proper colors
  const createEdge = (sourceId: string, targetId: string, sourceType: string, targetType?: string, label?: string) => {
    const edgeColor = getEdgeColor(sourceType, targetType, label)
    return {
      id: `${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: "custom",
      label,
      style: {
        stroke: edgeColor,
      },
      markerEnd: {
        type: "arrowclosed",
        color: edgeColor,
      },
      data: {
        sourceType,
        targetType,
      },
    }
  }

  stages.forEach((stage, stageIndex) => {
    // Create stage node with better positioning
    const stagePosition = calculateNodePosition(stageIndex, 0)
    const stageNode: Node = {
      id: stage.id,
      type: "stage",
      position: stagePosition,
      data: {
        label: stage.name,
        type: "STAGE",
        stage: {
          id: stage.id,
          name: stage.name,
          tasks: stage.tasks || [],
          postTransformationId: stage.postTransformationId,
        },
      },
      draggable: true,
    }
    nodes.push(stageNode)

    let previousTaskId = stage.id
    let previousTaskType = "STAGE"

    // Create task nodes for this stage with better spacing
    stage.tasks?.forEach((task, taskIndex) => {
      if (task.type === "SEQUENTIAL" && task.tasks) {
        // Handle sequential task group
        const taskPosition = calculateNodePosition(stageIndex, taskIndex + 1)
        const sequentialGroupNode: Node = {
          id: task.id,
          type: "sequential",
          position: taskPosition,
          data: {
            label: task.name,
            type: "SEQUENTIAL",
            task: {
              id: task.id,
              name: task.name,
              type: task.type,
              responseKey: task.responseKey,
              tasks: task.tasks,
            },
          },
          draggable: true,
        }
        nodes.push(sequentialGroupNode)

        // Connect stage to sequential group
        edges.push(createEdge(previousTaskId, task.id, previousTaskType, "SEQUENTIAL"))

        // Create individual task nodes within the sequential group
        let previousNestedTaskId = task.id
        let previousNestedTaskType = "SEQUENTIAL"

        task.tasks.forEach((nestedTask, nestedIndex) => {
          const nestedPosition = calculateNodePosition(stageIndex, taskIndex + 1, nestedIndex, true)
          const nestedTaskNode: Node = {
            id: nestedTask.id,
            type: "task",
            position: nestedPosition,
            data: {
              label: nestedTask.name,
              type: nestedTask.type,
              task: {
                id: nestedTask.id,
                name: nestedTask.name,
                type: nestedTask.type,
                responseKey: nestedTask.responseKey,
                endpointId: nestedTask.endpointId,
                transformationId: nestedTask.transformationId,
              },
            },
            draggable: true,
          }
          nodes.push(nestedTaskNode)

          // Connect sequential group to first nested task, or previous nested task to current
          edges.push(createEdge(previousNestedTaskId, nestedTask.id, previousNestedTaskType, nestedTask.type))

          previousNestedTaskId = nestedTask.id
          previousNestedTaskType = nestedTask.type
        })

        previousTaskId = task.tasks[task.tasks.length - 1]?.id || task.id
        previousTaskType = task.tasks[task.tasks.length - 1]?.type || task.type
      } else if (task.type === "PARALLEL" && task.tasks) {
        // Handle parallel task group with better positioning
        const taskPosition = calculateNodePosition(stageIndex, taskIndex + 1)
        const parallelGroupNode: Node = {
          id: task.id,
          type: "parallel",
          position: taskPosition,
          data: {
            label: task.name,
            type: "PARALLEL",
            task: {
              id: task.id,
              name: task.name,
              type: task.type,
              responseKey: task.responseKey,
              tasks: task.tasks,
            },
          },
          draggable: true,
        }
        nodes.push(parallelGroupNode)

        // Connect stage to parallel group
        edges.push(createEdge(previousTaskId, task.id, previousTaskType, "PARALLEL"))

        // Create individual task nodes within the parallel group
        task.tasks.forEach((nestedTask, nestedIndex) => {
          const nestedPosition = calculateNodePosition(stageIndex, taskIndex + 1, nestedIndex, true)
          const nestedTaskNode: Node = {
            id: nestedTask.id,
            type: "task",
            position: nestedPosition,
            data: {
              label: nestedTask.name,
              type: nestedTask.type,
              task: {
                id: nestedTask.id,
                name: nestedTask.name,
                type: nestedTask.type,
                responseKey: nestedTask.responseKey,
                endpointId: nestedTask.endpointId,
                transformationId: nestedTask.transformationId,
              },
            },
            draggable: true,
          }
          nodes.push(nestedTaskNode)

          // Connect parallel group to all nested tasks
          edges.push(createEdge(task.id, nestedTask.id, "PARALLEL", nestedTask.type))
        })

        previousTaskId = task.id
        previousTaskType = task.type
      } else {
        // Handle regular task with better positioning
        const taskPosition = calculateNodePosition(stageIndex, taskIndex + 1)
        const taskNode: Node = {
          id: task.id,
          type: "task",
          position: taskPosition,
          data: {
            label: task.name,
            type: task.type,
            task: {
              id: task.id,
              name: task.name,
              type: task.type,
              responseKey: task.responseKey,
              endpointId: task.endpointId,
              transformationId: task.transformationId,
            },
          },
          draggable: true,
        }
        nodes.push(taskNode)

        // Connect to previous task or stage
        edges.push(createEdge(previousTaskId, task.id, previousTaskType, task.type))

        previousTaskId = task.id
        previousTaskType = task.type
      }
    })

    // Handle stage transitions (nextStage) with better positioning
    if (stage.nextStage) {
      if (stage.nextStage.type === "CHOICE" && stage.nextStage.conditions) {
        // Create condition node with better positioning
        const conditionPosition = {
          x: 100 + 300 + ((stage.tasks?.length || 0) + 1) * 320,
          y: stagePosition.y + 100,
        }

        const conditionNode: Node = {
          id: `${stage.id}_condition`,
          type: "condition",
          position: conditionPosition,
          data: {
            label: "Decision Point",
            type: "CONDITION",
            condition: {
              type: stage.nextStage.type,
              conditions: stage.nextStage.conditions,
              defaultStage: stage.nextStage.defaultStage,
            },
          },
          draggable: true,
        }
        nodes.push(conditionNode)

        // Connect last task to condition
        edges.push(createEdge(previousTaskId, `${stage.id}_condition`, previousTaskType, "CONDITION"))

        // Connect condition to next stages
        stage.nextStage.conditions.forEach((condition, condIndex) => {
          const targetStage = stages.find((s) => s.id === condition.stage)
          if (targetStage) {
            edges.push(createEdge(`${stage.id}_condition`, condition.stage, "CONDITION", "STAGE", "true"))
          }
        })

        // Connect to default stage if exists
        if (stage.nextStage.defaultStage) {
          const defaultStage = stages.find((s) => s.id === stage.nextStage.defaultStage)
          if (defaultStage) {
            edges.push(
              createEdge(`${stage.id}_condition`, stage.nextStage.defaultStage, "CONDITION", "STAGE", "default"),
            )
          }
        }
      }
    }
  })

  console.log("✅ Generated nodes and edges:", { nodeCount: nodes.length, edgeCount: edges.length })
  return { nodes, edges }
}

export function convertNodesToJson(nodes: Node[], edges: Edge[], originalFlowData: FlowData): FlowData {
  console.log("🔄 convertNodesToJson called with:", { nodeCount: nodes.length, edgeCount: edges.length })

  // Start with the original flow data structure
  const updatedFlowData = { ...originalFlowData }

  // Always update the nodes and edges
  updatedFlowData.nodes = nodes
  updatedFlowData.edges = edges

  // Try to rebuild the composition structure from nodes if we have stage nodes
  const stageNodes = nodes.filter((node) => node.data.type === "STAGE")

  if (stageNodes.length > 0 && updatedFlowData.composition) {
    console.log("🏗️ Rebuilding composition from stage nodes")

    // Update existing stages with node data
    const updatedStages =
      updatedFlowData.composition.stages?.map((originalStage) => {
        const stageNode = stageNodes.find((node) => node.id === originalStage.id)

        if (stageNode) {
          return {
            ...originalStage,
            name: stageNode.data.stage?.name || stageNode.data.label || originalStage.name,
            // Keep other original properties
          }
        }

        return originalStage
      }) || []

    // Add any new stage nodes that don't exist in original composition
    stageNodes.forEach((stageNode) => {
      const existsInOriginal = updatedStages.some((stage) => stage.id === stageNode.id)
      if (!existsInOriginal) {
        console.log("➕ Adding new stage to composition:", stageNode.id)
        updatedStages.push({
          id: stageNode.id,
          name: stageNode.data.stage?.name || stageNode.data.label || "New Stage",
          tasks: stageNode.data.stage?.tasks || [],
          postTransformationId: stageNode.data.stage?.postTransformationId,
        })
      }
    })

    updatedFlowData.composition.stages = updatedStages
  }

  console.log("✅ Updated flow data:", updatedFlowData)
  return updatedFlowData
}
