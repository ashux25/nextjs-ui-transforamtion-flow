import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would save this to a database
const flowStorage: any[] = []

export async function POST(request: NextRequest) {
  try {
    const flowData = await request.json()

    // Add timestamp and ID if not present
    const enrichedFlow = {
      ...flowData,
      updatedAt: new Date().toISOString(),
      id: flowData._id?.$oid || Date.now().toString(),
    }

    // In a real app, save to database
    flowStorage.push(enrichedFlow)

    console.log("Flow saved:", enrichedFlow.composition?.name || "Unnamed Flow")

    return NextResponse.json({
      success: true,
      message: "Flow saved successfully",
      id: enrichedFlow.id,
    })
  } catch (error) {
    console.error("Error saving flow:", error)
    return NextResponse.json({ success: false, message: "Failed to save flow" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      flows: flowStorage,
    })
  } catch (error) {
    console.error("Error fetching flows:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch flows" }, { status: 500 })
  }
}
