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

    // Mock payout data - replace with actual database queries
    const payouts = [
      {
        id: "1",
        cvcName: "Dr. Sarah Johnson",
        cvcEmail: "sarah.johnson@email.com",
        amount: 2850,
        period: "May 2024",
        status: "pending",
        requestDate: "2024-06-01",
        scheduledDate: "2024-06-15",
      },
      {
        id: "2",
        cvcName: "Dr. Michael Chen",
        cvcEmail: "michael.chen@email.com",
        amount: 3200,
        period: "May 2024",
        status: "processing",
        requestDate: "2024-06-01",
        scheduledDate: "2024-06-15",
      },
      {
        id: "3",
        cvcName: "Dr. Emily Rodriguez",
        cvcEmail: "emily.rodriguez@email.com",
        amount: 2650,
        period: "May 2024",
        status: "completed",
        requestDate: "2024-05-01",
        scheduledDate: "2024-05-15",
      },
    ]

    return NextResponse.json({ payouts })
  } catch (error) {
    console.error("Error fetching payouts:", error)
    return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { payoutIds, processingDate } = body

    // Mock batch payout processing - replace with actual payment processing
    console.log("Processing batch payout:", { payoutIds, processingDate })

    return NextResponse.json({
      success: true,
      message: "Batch payout processed successfully",
      processedCount: payoutIds.length,
    })
  } catch (error) {
    console.error("Error processing batch payout:", error)
    return NextResponse.json({ error: "Failed to process batch payout" }, { status: 500 })
  }
}
