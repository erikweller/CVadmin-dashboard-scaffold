import { Box, Typography, Breadcrumbs, Link } from "@mui/material"
import { UserManagement } from "@/components/admin/UserManagement"

export default function UsersPage() {
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/admin">
          Admin
        </Link>
        <Typography color="text.primary">Users</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user accounts, permissions, and activity
        </Typography>
      </Box>

      {/* User Management Component */}
      <UserManagement />
    </Box>
  )
}
