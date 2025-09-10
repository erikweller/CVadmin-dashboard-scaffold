import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { status } = body

    // TODO: Implement actual meeting status update logic
    console.log(`Updating meeting ${id} status to: ${status}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating meeting status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
