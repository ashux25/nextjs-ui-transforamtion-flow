"use client"

import { useState, useCallback } from "react"
import FlowBuilder from "@/components/flow-builder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import FlowTestPanel from "@/components/flow-test-panel"
import FlowLegend from "@/components/flow-legend"
import type { FlowData } from "@/utils/flow-converter"
import LayoutOptimizer from "@/components/layout-optimizer"

const initialFlowData: FlowData = {
  _id: { $oid: "684955f4b78a0eaeddbfa563" },
  partner_code: "CRIS",
  product_code: "api",
  api_version: "v1",
  resource_url: "/tier-benefits-fetch3",
  target_stream: "",
  request_method: "GET",
  created_by: "errol.dsylva@jetprivilege.com",
  is_enable: true,
  application_name: "Simplica",
  policies: [],
  target_url: "",
  endpoint_content_type: "application/json",
  max_payload_buffer_size: 10000,
  parse_payload: true,
  rules: "",
  routingDSL: "",
  _class: "com.intermiles.toran_management.entities.ToranApiContract",
  is_api_composition_enabled: true,
  composition: {
    type: "STAGE_FLOW",
    name: "User Benefits Flow",
    version: "1.0",
    stages: [
      {
        id: "stage1",
        name: "User Profile and Benefits",
        postTransformationId: "685928701f8f00e9d8669609",
        tasks: [
          {
            id: "task1.1",
            name: "User Profile Flow",
            type: "SEQUENTIAL",
            responseKey: "userProfileFinal",
            tasks: [
              {
                id: "task1.1.1",
                name: "User Profile API Call",
                type: "API_CALL",
                endpointId: "67939c85e2094c15f72cbc59",
                responseKey: "userProfileResponse",
              },
              {
                id: "task1.1.2",
                name: "Post-API Transform",
                type: "TRANSFORMATION",
                transformationId: "685928591f8f00e9d8669608",
                responseKey: "userProfileOutput",
              },
            ],
          },
          {
            id: "task1.2",
            name: "Benefits Flow",
            type: "SEQUENTIAL",
            responseKey: "benefitsFinal",
            tasks: [
              {
                id: "task1.2.1",
                name: "Benefits API Call",
                type: "API_CALL",
                endpointId: "67a9ca4db3cf157b89070c3f",
                responseKey: "benefitsResponse",
              },
              {
                id: "task1.2.2",
                name: "Post-API Transform",
                type: "TRANSFORMATION",
                transformationId: "685928591f8f00e9d8669608",
                responseKey: "benefitsOutput",
              },
            ],
          },
        ],
        nextStage: {
          type: "CHOICE",
          defaultStage: "errorStage",
          conditions: [
            {
              condition: {
                type: "EXPRESSION",
                expression: "response.PartnerCouponDetails.Status == true",
                operator: "EQUALS",
                dataType: "BOOLEAN",
                value: true,
              },
              stage: "stage2",
            },
          ],
        },
      },
      {
        id: "stage2",
        name: "2 User Profile and Benefits",
        postTransformationId: "685928701f8f00e9d8669609",
        tasks: [
          {
            id: "task2.1",
            name: "User Profile Flow",
            type: "SEQUENTIAL",
            responseKey: "userProfileFinal",
            tasks: [
              {
                id: "task2.1.1",
                name: "User Profile API Call",
                type: "API_CALL",
                endpointId: "67939c85e2094c15f72cbc59",
                responseKey: "userProfileResponse",
              },
              {
                id: "task2.1.2",
                name: "Post-API Transform",
                type: "TRANSFORMATION",
                transformationId: "685928591f8f00e9d8669608",
                responseKey: "userProfileOutput",
              },
            ],
          },
          {
            id: "task2.2",
            name: "Benefits Flow",
            type: "SEQUENTIAL",
            responseKey: "benefitsFinal",
            tasks: [
              {
                id: "task2.2.1",
                name: "Benefits API Call",
                type: "API_CALL",
                endpointId: "67a9ca4db3cf157b89070c3f",
                responseKey: "benefitsResponse",
              },
              {
                id: "task2.2.2",
                name: "Post-API Transform",
                type: "TRANSFORMATION",
                transformationId: "685928591f8f00e9d8669608",
                responseKey: "benefitsOutput",
              },
            ],
          },
        ],
      },
      {
        id: "errorStage",
        name: "Error Handling",
        tasks: [
          {
            id: "task6",
            name: "Error Transformation",
            type: "TRANSFORMATION",
            transformationId: "67bc6c69f6170d2f91adcd82",
            responseKey: "errorOutput",
          },
        ],
      },
    ],
    startStage: "stage1",
  },
}

export default function Home() {
  console.log("🏠 Home component render")

  const [flowData, setFlowData] = useState<FlowData>(initialFlowData)
  const [jsonInput, setJsonInput] = useState(JSON.stringify(initialFlowData, null, 2))
  const [isSaving, setIsSaving] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0) // Force re-render key

  const handleOptimizeLayout = () => {
    console.log("🎯 Optimizing layout")

    if (!flowData.nodes) return

    const optimizedNodes = flowData.nodes.map((node, index) => {
      const row = Math.floor(index / 4) // 4 nodes per row
      const col = index % 4

      return {
        ...node,
        position: {
          x: 100 + col * 350, // Horizontal spacing
          y: 100 + row * 200, // Vertical spacing
        },
      }
    })

    const updatedFlowData = {
      ...flowData,
      nodes: optimizedNodes,
    }

    setFlowData(updatedFlowData)
    setJsonInput(JSON.stringify(updatedFlowData, null, 2))
    setForceUpdate((prev) => prev + 1) // Force re-render
  }

  const handleRandomizeLayout = () => {
    console.log("🎲 Randomizing layout")

    if (!flowData.nodes) return

    const randomizedNodes = flowData.nodes.map((node) => ({
      ...node,
      position: {
        x: Math.random() * 1000 + 100,
        y: Math.random() * 600 + 100,
      },
    }))

    const updatedFlowData = {
      ...flowData,
      nodes: randomizedNodes,
    }

    setFlowData(updatedFlowData)
    setJsonInput(JSON.stringify(updatedFlowData, null, 2))
    setForceUpdate((prev) => prev + 1) // Force re-render
  }

  const handleAddTestNodes = () => {
    console.log("🧪 Adding test nodes")

    const testNodes = [
      {
        id: "test_stage_1",
        type: "stage",
        position: { x: 100, y: 100 },
        data: {
          label: "Test Stage 1",
          type: "STAGE",
          stage: {
            id: "test_stage_1",
            name: "Test Stage 1",
            tasks: [],
          },
        },
      },
      {
        id: "test_api_1",
        type: "task",
        position: { x: 400, y: 100 },
        data: {
          label: "Test API Call",
          type: "API_CALL",
          task: {
            id: "test_api_1",
            name: "Test API Call",
            type: "API_CALL",
            responseKey: "test_api_response",
            endpointId: "test_endpoint_123",
          },
        },
      },
      {
        id: "test_transform_1",
        type: "task",
        position: { x: 700, y: 100 },
        data: {
          label: "Test Transform",
          type: "TRANSFORMATION",
          task: {
            id: "test_transform_1",
            name: "Test Transform",
            type: "TRANSFORMATION",
            responseKey: "test_transform_response",
            transformationId: "test_transform_123",
          },
        },
      },
      {
        id: "test_condition_1",
        type: "condition",
        position: { x: 400, y: 300 },
        data: {
          label: "Test Condition",
          type: "CONDITION",
          condition: {
            type: "CHOICE",
            conditions: [
              {
                condition: {
                  type: "EXPRESSION",
                  expression: "response.status == 'success'",
                  operator: "EQUALS",
                  dataType: "BOOLEAN",
                  value: true,
                },
                stage: "test_stage_2",
              },
            ],
            defaultStage: "error_stage",
          },
        },
      },
      {
        id: "test_parallel_1",
        type: "parallel",
        position: { x: 700, y: 300 },
        data: {
          label: "Test Parallel Tasks",
          type: "PARALLEL",
          task: {
            id: "test_parallel_1",
            name: "Test Parallel Tasks",
            type: "PARALLEL",
            responseKey: "test_parallel_response",
            tasks: [],
          },
        },
      },
    ]

    const testEdges = [
      {
        id: "test_edge_1",
        source: "test_stage_1",
        target: "test_api_1",
        type: "custom",
        style: { stroke: "#3B82F6" },
        markerEnd: { type: "arrowclosed", color: "#3B82F6" },
      },
      {
        id: "test_edge_2",
        source: "test_api_1",
        target: "test_transform_1",
        type: "custom",
        style: { stroke: "#8B5CF6" },
        markerEnd: { type: "arrowclosed", color: "#8B5CF6" },
      },
      {
        id: "test_edge_3",
        source: "test_stage_1",
        target: "test_condition_1",
        type: "custom",
        style: { stroke: "#3B82F6" },
        markerEnd: { type: "arrowclosed", color: "#3B82F6" },
      },
      {
        id: "test_edge_4",
        source: "test_condition_1",
        target: "test_parallel_1",
        type: "custom",
        label: "true",
        style: { stroke: "#10B981" },
        markerEnd: { type: "arrowclosed", color: "#10B981" },
      },
    ]

    const updatedFlowData = {
      ...flowData,
      nodes: [...(flowData.nodes || []), ...testNodes],
      edges: [...(flowData.edges || []), ...testEdges],
    }

    console.log("🧪 Test nodes created:", {
      totalNodes: updatedFlowData.nodes?.length || 0,
      totalEdges: updatedFlowData.edges?.length || 0,
    })

    setFlowData(updatedFlowData)
    setJsonInput(JSON.stringify(updatedFlowData, null, 2))
    setForceUpdate((prev) => prev + 1) // Force re-render
  }

  const handleFlowUpdate = useCallback(
    (updatedFlow: FlowData) => {
      console.log("📨 handleFlowUpdate called", {
        currentNodesCount: flowData?.nodes?.length || 0,
        newNodesCount: updatedFlow?.nodes?.length || 0,
      })

      // Always update both flowData and jsonInput to keep them in sync
      setFlowData(updatedFlow)
      setJsonInput(JSON.stringify(updatedFlow, null, 2))
    },
    [flowData],
  )

  const handleSaveFlow = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/flows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flowData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Flow saved successfully!",
        })
      } else {
        throw new Error("Failed to save flow")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save flow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleJsonUpdate = () => {
    try {
      console.log("📝 Updating from JSON input")
      const parsedData = JSON.parse(jsonInput)

      // Clear existing nodes/edges to force regeneration from composition
      const cleanedData = {
        ...parsedData,
        nodes: undefined, // Clear nodes to force regeneration
        edges: undefined, // Clear edges to force regeneration
      }

      console.log("🔄 Setting cleaned flow data:", cleanedData)
      setFlowData(cleanedData)
      setForceUpdate((prev) => prev + 1) // Force re-render

      toast({
        title: "Success",
        description: "Flow updated from JSON!",
      })
    } catch (error) {
      console.error("❌ JSON parse error:", error)
      toast({
        title: "Error",
        description: "Invalid JSON format. Please check your input.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Flow Builder</h1>
          <p className="text-gray-600">Create and manage your API composition flows visually</p>
        </div>

        <div className="flex gap-4 mb-4">
          <FlowTestPanel
            onAddTestNodes={handleAddTestNodes}
            nodeCount={flowData?.nodes?.length || 0}
            edgeCount={flowData?.edges?.length || 0}
          />
          <FlowLegend />
          <LayoutOptimizer onOptimizeLayout={handleOptimizeLayout} onRandomizeLayout={handleRandomizeLayout} />
        </div>

        <div className="mb-4 flex gap-2">
          <Button onClick={handleSaveFlow} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Flow"}
          </Button>
        </div>

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="json">JSON Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Flow Diagram</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[700px]">
                  <FlowBuilder
                    key={forceUpdate} // Force re-render when key changes
                    flowData={flowData}
                    onFlowUpdate={handleFlowUpdate}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>JSON Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[500px] font-mono text-sm"
                    placeholder="Enter your flow JSON configuration..."
                  />
                  <Button onClick={handleJsonUpdate}>Update Flow from JSON</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
