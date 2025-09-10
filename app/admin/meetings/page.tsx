import { Box, Typography, Breadcrumbs, Link } from "@mui/material"
import { MeetingManagement } from "@/components/admin/MeetingManagement"

export default function MeetingsPage() {
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/admin">
          Admin
        </Link>
        <Typography color="text.primary">Meetings</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Meeting Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage sessions, appointments, and meeting schedules
        </Typography>
      </Box>

      {/* Meeting Management Component */}
      <MeetingManagement />
    </Box>
  )
}
