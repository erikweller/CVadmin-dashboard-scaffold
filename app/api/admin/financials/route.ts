import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock financial data - replace with actual database queries
    const financialData = {
      totalRevenue: 127450,
      cvcEarnings: 89215,
      platformRevenue: 38235,
      pendingPayouts: 12890,
      revenueGrowth: 12.5,
      monthlyRevenue: [
        { month: "Jan", total: 85000, cvc: 59500, platform: 25500 },
        { month: "Feb", total: 92000, cvc: 64400, platform: 27600 },
        { month: "Mar", total: 78000, cvc: 54600, platform: 23400 },
        { month: "Apr", total: 105000, cvc: 73500, platform: 31500 },
        { month: "May", total: 118000, cvc: 82600, platform: 35400 },
        { month: "Jun", total: 127450, cvc: 89215, platform: 38235 },
      ],
      revenueByService: [
        { name: "Individual Therapy", value: 45000, percentage: 35.3 },
        { name: "Group Sessions", value: 32000, percentage: 25.1 },
        { name: "Family Counseling", value: 28000, percentage: 22.0 },
        { name: "Crisis Support", value: 15000, percentage: 11.8 },
        { name: "Workshops", value: 7450, percentage: 5.8 },
      ],
      topCVCs: [
        { name: "Dr. Sarah Johnson", revenue: 8500, sessions: 42, rating: 4.9 },
        { name: "Dr. Michael Chen", revenue: 7800, sessions: 39, rating: 4.8 },
        { name: "Dr. Emily Rodriguez", revenue: 7200, sessions: 36, rating: 4.9 },
        { name: "Dr. James Wilson", revenue: 6900, sessions: 35, rating: 4.7 },
        { name: "Dr. Lisa Thompson", revenue: 6500, sessions: 33, rating: 4.8 },
      ],
    }

    return NextResponse.json(financialData)
  } catch (error) {
    console.error("Error fetching financial data:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}
