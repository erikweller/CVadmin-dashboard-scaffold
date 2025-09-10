import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

// Mock calendar events for scaffold
const mockCalendarEvents = [
  {
    id: "event-1",
    title: "Anxiety Management",
    scheduledAt: "2024-01-22T10:00:00Z",
    duration: 60,
    type: "individual",
    status: "scheduled",
    cvcName: "Dr. Smith",
    clientName: "Sarah J.",
  },
  {
    id: "event-2",
    title: "CVC Interview",
    scheduledAt: "2024-01-22T14:00:00Z",
    duration: 45,
    type: "interview",
    status: "scheduled",
    cvcName: "Admin",
    clientName: "New Applicant",
  },
  {
    id: "event-3",
    title: "Group Therapy",
    scheduledAt: "2024-01-23T16:00:00Z",
    duration: 120,
    type: "group",
    status: "scheduled",
    cvcName: "Dr. Johnson",
    clientName: "Support Group",
  },
  {
    id: "event-4",
    title: "Depression Session",
    scheduledAt: "2024-01-24T11:00:00Z",
    duration: 60,
    type: "individual",
    status: "completed",
    cvcName: "Maria Garcia",
    clientName: "Michael S.",
  },
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    // Filter events by date range if provided
    let filteredEvents = mockCalendarEvents

    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      filteredEvents = mockCalendarEvents.filter((event) => {
        const eventDate = new Date(event.scheduledAt)
        return eventDate >= startDate && eventDate <= endDate
      })
    }

    return NextResponse.json(filteredEvents)
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
