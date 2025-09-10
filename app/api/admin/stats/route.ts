import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Replace with actual database queries
    // This is mock data for the scaffold
    const stats = {
      activeUsers: 1247,
      connectedCalendars: 89,
      meetings30d: 342,
      totalRevenue: 125400, // in cents
      activeCVCs: 23,
      pendingPayouts: 8,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
