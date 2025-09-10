"use client"

import React from "react"
import { Box, Typography, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const revenueData = [
  { month: "Jan", total: 85000, cvc: 59500, platform: 25500 },
  { month: "Feb", total: 92000, cvc: 64400, platform: 27600 },
  { month: "Mar", total: 78000, cvc: 54600, platform: 23400 },
  { month: "Apr", total: 105000, cvc: 73500, platform: 31500 },
  { month: "May", total: 118000, cvc: 82600, platform: 35400 },
  { month: "Jun", total: 127450, cvc: 89215, platform: 38235 },
]

export default function RevenueChart() {
  const [timeRange, setTimeRange] = React.useState("6months")

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Revenue Trends
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} label="Time Range" onChange={(e) => setTimeRange(e.target.value)}>
            <MenuItem value="3months">3 Months</MenuItem>
            <MenuItem value="6months">6 Months</MenuItem>
            <MenuItem value="1year">1 Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Revenue Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                  <Line type="monotone" dataKey="total" stroke="#4F5B93" strokeWidth={3} />
                  <Line type="monotone" dataKey="cvc" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="platform" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Revenue Split (Current Month)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: "Revenue", cvc: 89215, platform: 38235 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                  <Bar dataKey="cvc" stackId="a" fill="#82ca9d" name="CVC Earnings (70%)" />
                  <Bar dataKey="platform" stackId="a" fill="#4F5B93" name="Platform Revenue (30%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
