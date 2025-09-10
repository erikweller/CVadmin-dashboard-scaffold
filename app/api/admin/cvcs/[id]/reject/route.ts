import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // TODO: Implement actual CVC rejection logic
    console.log(`Rejecting CVC ${id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error rejecting CVC:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
