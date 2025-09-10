import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

// Mock meeting data for scaffold
const mockMeetings = [
  {
    id: "meeting-1",
    cvcId: "Dr. Smith",
    clientId: "Sarah J.",
    title: "Anxiety Management Session",
    scheduledAt: "2024-01-22T10:00:00Z",
    duration: 60,
    status: "scheduled" as const,
    type: "individual" as const,
    revenue: 12000, // $120 in cents
  },
  {
    id: "meeting-2",
    cvcId: "Maria Garcia",
    clientId: "David C.",
    title: "Relationship Counseling",
    scheduledAt: "2024-01-22T14:30:00Z",
    duration: 90,
    status: "completed" as const,
    type: "individual" as const,
    revenue: 18000, // $180 in cents
  },
  {
    id: "meeting-3",
    cvcId: "Dr. Johnson",
    clientId: "Group A",
    title: "Grief Support Group",
    scheduledAt: "2024-01-23T16:00:00Z",
    duration: 120,
    status: "scheduled" as const,
    type: "group" as const,
    revenue: 24000, // $240 in cents
  },
  {
    id: "meeting-4",
    cvcId: "Dr. Smith",
    clientId: "Emily R.",
    title: "Depression Therapy",
    scheduledAt: "2024-01-21T11:00:00Z",
    duration: 60,
    status: "cancelled" as const,
    type: "individual" as const,
    revenue: 0,
  },
  {
    id: "meeting-5",
    cvcId: "Maria Garcia",
    clientId: "Michael S.",
    title: "Family Therapy Session",
    scheduledAt: "2024-01-20T15:00:00Z",
    duration: 90,
    status: "no-show" as const,
    type: "individual" as const,
    revenue: 0,
  },
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const status = searchParams.get("status") || "all"
    const type = searchParams.get("type") || "all"
    const page = Number.parseInt(searchParams.get("page") || "0")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "25")

    // Filter mock data based on query parameters
    let filteredMeetings = mockMeetings

    if (query) {
      filteredMeetings = filteredMeetings.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(query.toLowerCase()) ||
          meeting.cvcId.toLowerCase().includes(query.toLowerCase()) ||
          meeting.clientId.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (status !== "all") {
      filteredMeetings = filteredMeetings.filter((meeting) => meeting.status === status)
    }

    if (type !== "all") {
      filteredMeetings = filteredMeetings.filter((meeting) => meeting.type === type)
    }

    // Pagination
    const total = filteredMeetings.length
    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize
    const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex)

    return NextResponse.json({
      items: paginatedMeetings,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error("Error fetching meetings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, cvcId, clientId, scheduledAt, duration, type, status, revenue } = body

    // TODO: Implement actual meeting creation logic
    const newMeeting = {
      id: `meeting-${Date.now()}`,
      title,
      cvcId,
      clientId,
      scheduledAt,
      duration,
      type,
      status,
      revenue,
    }

    return NextResponse.json(newMeeting, { status: 201 })
  } catch (error) {
    console.error("Error creating meeting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
