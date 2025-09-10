import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

// Mock CVC data for scaffold
const mockCVCs = [
  {
    id: "cvc-1",
    userId: "2",
    email: "dr.smith@carevillage.io",
    name: "Dr. Michael Smith",
    specialties: ["Anxiety", "Depression", "Trauma"],
    status: "approved" as const,
    applicationDate: "2024-01-10T09:15:00Z",
    approvalDate: "2024-01-15T14:30:00Z",
    rating: 4.8,
    totalSessions: 156,
    totalEarnings: 23400, // in cents
  },
  {
    id: "cvc-2",
    userId: "3",
    email: "maria.garcia@example.com",
    name: "Maria Garcia",
    specialties: ["Relationships", "Family Therapy"],
    status: "approved" as const,
    applicationDate: "2024-01-12T11:20:00Z",
    approvalDate: "2024-01-18T10:15:00Z",
    rating: 4.9,
    totalSessions: 89,
    totalEarnings: 13350,
  },
  {
    id: "cvc-3",
    userId: "6",
    email: "dr.johnson@example.com",
    name: "Dr. Sarah Johnson",
    specialties: ["Grief & Loss", "Trauma", "ADHD"],
    status: "pending" as const,
    applicationDate: "2024-01-20T16:45:00Z",
    rating: undefined,
    totalSessions: 0,
    totalEarnings: 0,
  },
  {
    id: "cvc-4",
    userId: "7",
    email: "therapist.chen@example.com",
    name: "David Chen",
    specialties: ["Addiction", "Depression"],
    status: "pending" as const,
    applicationDate: "2024-01-19T13:30:00Z",
    rating: undefined,
    totalSessions: 0,
    totalEarnings: 0,
  },
  {
    id: "cvc-5",
    userId: "8",
    email: "rejected.therapist@example.com",
    name: "John Doe",
    specialties: ["Anxiety"],
    status: "rejected" as const,
    applicationDate: "2024-01-08T12:00:00Z",
    rating: undefined,
    totalSessions: 0,
    totalEarnings: 0,
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
    const specialty = searchParams.get("specialty") || "all"
    const page = Number.parseInt(searchParams.get("page") || "0")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "25")

    // Filter mock data based on query parameters
    let filteredCVCs = mockCVCs

    if (query) {
      filteredCVCs = filteredCVCs.filter(
        (cvc) =>
          cvc.name.toLowerCase().includes(query.toLowerCase()) ||
          cvc.email.toLowerCase().includes(query.toLowerCase()) ||
          cvc.specialties.some((s) => s.toLowerCase().includes(query.toLowerCase())),
      )
    }

    if (status !== "all") {
      filteredCVCs = filteredCVCs.filter((cvc) => cvc.status === status)
    }

    if (specialty !== "all") {
      filteredCVCs = filteredCVCs.filter((cvc) =>
        cvc.specialties.some((s) => s.toLowerCase() === specialty.toLowerCase()),
      )
    }

    // Pagination
    const total = filteredCVCs.length
    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize
    const paginatedCVCs = filteredCVCs.slice(startIndex, endIndex)

    return NextResponse.json({
      items: paginatedCVCs,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error("Error fetching CVCs:", error)
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
    const { name, email, specialties, status } = body

    // TODO: Implement actual CVC creation logic
    const newCVC = {
      id: `cvc-${Date.now()}`,
      userId: Date.now().toString(),
      email,
      name,
      specialties,
      status,
      applicationDate: new Date().toISOString(),
      rating: undefined,
      totalSessions: 0,
      totalEarnings: 0,
    }

    return NextResponse.json(newCVC, { status: 201 })
  } catch (error) {
    console.error("Error creating CVC:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
