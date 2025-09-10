import { Box, Typography, Breadcrumbs, Link } from "@mui/material"
import { CVCManagement } from "@/components/admin/CVCManagement"

export default function CVCsPage() {
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/admin">
          Admin
        </Link>
        <Typography color="text.primary">CVCs</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          CVC Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage CareVillage Counselors, applications, and performance
        </Typography>
      </Box>

      {/* CVC Management Component */}
      <CVCManagement />
    </Box>
  )
}
