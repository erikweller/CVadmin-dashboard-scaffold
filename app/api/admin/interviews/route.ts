import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { cvcId, scheduledAt, duration, type, notes, interviewer } = body

    // TODO: Implement actual interview scheduling logic
    const interview = {
      id: Date.now().toString(),
      cvcId,
      scheduledAt,
      duration,
      type,
      notes,
      interviewer,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    console.log("Scheduling interview:", interview)

    return NextResponse.json(interview, { status: 201 })
  } catch (error) {
    console.error("Error scheduling interview:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
