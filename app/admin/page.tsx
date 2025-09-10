import { Box, Grid, Typography, Breadcrumbs, Link } from "@mui/material"
import StatCard from "@/components/admin/StatCard"
import { RecentActivity } from "@/components/admin/RecentActivity"
import { QuickActions } from "@/components/admin/QuickActions"

async function getDashboardStats() {
  // In production, this would fetch from your API
  // For now, using mock data for the scaffold
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/stats`, {
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error("Failed to fetch stats")
    }
    return await response.json()
  } catch (error) {
    // Fallback to mock data if API fails
    return {
      activeUsers: 1247,
      connectedCalendars: 89,
      meetings30d: 342,
      totalRevenue: 125400,
      activeCVCs: 23,
      pendingPayouts: 8,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/admin">
          Admin
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your CareVillage platform performance and key metrics
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            subtitle="Total registered users"
            trend="+12%"
            trendUp={true}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Connected Calendars"
            value={stats.connectedCalendars.toLocaleString()}
            subtitle="Nylas integrations"
            trend="+5%"
            trendUp={true}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Meetings (30d)"
            value={stats.meetings30d.toLocaleString()}
            subtitle="Sessions completed"
            trend="+18%"
            trendUp={true}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 100).toLocaleString()}`}
            subtitle="This month"
            trend="+23%"
            trendUp={true}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active CVCs"
            value={stats.activeCVCs.toLocaleString()}
            subtitle="Counselors online"
            trend="+2%"
            trendUp={true}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Payouts"
            value={stats.pendingPayouts.toLocaleString()}
            subtitle="Awaiting processing"
            trend="-15%"
            trendUp={false}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Dashboard Content Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <RecentActivity />
        </Grid>
        <Grid item xs={12} lg={4}>
          <QuickActions />
        </Grid>
      </Grid>
    </Box>
  )
}
