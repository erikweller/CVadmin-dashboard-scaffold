import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"

// Mock user data for scaffold
const mockUsers = [
  {
    id: "1",
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    createdAt: "2024-01-15T10:30:00Z",
    lastSignIn: "2024-01-20T14:22:00Z",
    role: "user",
    active: true,
  },
  {
    id: "2",
    email: "dr.smith@carevillage.io",
    name: "Dr. Michael Smith",
    createdAt: "2024-01-10T09:15:00Z",
    lastSignIn: "2024-01-20T16:45:00Z",
    role: "cvc",
    active: true,
  },
  {
    id: "3",
    email: "maria.garcia@example.com",
    name: "Maria Garcia",
    createdAt: "2024-01-12T11:20:00Z",
    lastSignIn: "2024-01-19T13:30:00Z",
    role: "cvc",
    active: true,
  },
  {
    id: "4",
    email: "admin@carevillage.io",
    name: "Admin User",
    createdAt: "2024-01-01T08:00:00Z",
    lastSignIn: "2024-01-20T17:00:00Z",
    role: "admin",
    active: true,
  },
  {
    id: "5",
    email: "david.chen@example.com",
    name: "David Chen",
    createdAt: "2024-01-18T15:45:00Z",
    lastSignIn: null,
    role: "user",
    active: false,
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
    const role = searchParams.get("role") || "all"
    const page = Number.parseInt(searchParams.get("page") || "0")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "25")

    // Filter mock data based on query parameters
    let filteredUsers = mockUsers

    if (query) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (status !== "all") {
      if (status === "active") {
        filteredUsers = filteredUsers.filter((user) => user.active)
      } else if (status === "inactive") {
        filteredUsers = filteredUsers.filter((user) => !user.active)
      }
    }

    if (role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    // Pagination
    const total = filteredUsers.length
    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return NextResponse.json({
      items: paginatedUsers,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
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
    const { name, email, role, active } = body

    // TODO: Implement actual user creation logic
    // This is a mock response for the scaffold
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role,
      active,
      createdAt: new Date().toISOString(),
      lastSignIn: null,
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
