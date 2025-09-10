"use client"

import React from "react"
import { Box, Typography, Grid, Card, CardContent, Tabs, Tab } from "@mui/material"
import StatCard from "@/components/admin/StatCard"
import RevenueChart from "@/components/admin/RevenueChart"
import PayoutManagement from "@/components/admin/PayoutManagement"
import RevenueBreakdown from "@/components/admin/RevenueBreakdown"

export default function FinancialsPage() {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: "#1a1a1a" }}>
        Financial Metrics & Payouts
      </Typography>

      {/* Financial Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue" value="$127,450" subtitle="Current month" trend="+12.5%" trendUp={true} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="CVC Earnings" value="$89,215" subtitle="70% of revenue" trend="+8.3%" trendUp={true} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Platform Revenue" value="$38,235" subtitle="30% of revenue" trend="+15.2%" trendUp={true} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Payouts"
            value="$12,890"
            subtitle="Awaiting processing"
            trend="-5.1%"
            trendUp={false}
          />
        </Grid>
      </Grid>

      {/* Tabs for different financial views */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Revenue Overview" />
          <Tab label="Payout Management" />
          <Tab label="Revenue Breakdown" />
        </Tabs>

        <CardContent>
          {tabValue === 0 && <RevenueChart />}
          {tabValue === 1 && <PayoutManagement />}
          {tabValue === 2 && <RevenueBreakdown />}
        </CardContent>
      </Card>
    </Box>
  )
}
