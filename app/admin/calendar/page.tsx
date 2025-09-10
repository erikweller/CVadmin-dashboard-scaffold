import { Box, Typography, Breadcrumbs, Link } from "@mui/material"
import { CalendarView } from "@/components/admin/CalendarView"

export default function CalendarPage() {
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/admin">
          Admin
        </Link>
        <Typography color="text.primary">Calendar</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Calendar & Scheduling
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all meetings, interviews, and appointments
        </Typography>
      </Box>

      {/* Calendar Component */}
      <CalendarView />
    </Box>
  )
}
