import type React from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { isAdmin } from "@/lib/auth/admin"
import { redirect } from "next/navigation"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { AdminSidebar } from "./AdminSidebar"
import { AdminTopBar } from "./AdminTopBar"
import { adminTheme } from "./theme"

interface AdminLayoutProps {
  children: React.ReactNode
}

export async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions)

  // Redirect unauthenticated users to sign in
  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/admin")
  }

  // Redirect non-admin users to home
  if (!isAdmin(session.user.email)) {
    redirect("/")
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AdminTopBar user={session.user} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f8f9fa" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
