import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const revenueByService = [
  { name: "Individual Therapy", value: 45000, percentage: 35.3, color: "#4F5B93" },
  { name: "Group Sessions", value: 32000, percentage: 25.1, color: "#82ca9d" },
  { name: "Family Counseling", value: 28000, percentage: 22.0, color: "#ffc658" },
  { name: "Crisis Support", value: 15000, percentage: 11.8, color: "#ff7c7c" },
  { name: "Workshops", value: 7450, percentage: 5.8, color: "#8884d8" },
]

const topCVCs = [
  { name: "Dr. Sarah Johnson", revenue: 8500, sessions: 42, rating: 4.9 },
  { name: "Dr. Michael Chen", revenue: 7800, sessions: 39, rating: 4.8 },
  { name: "Dr. Emily Rodriguez", revenue: 7200, sessions: 36, rating: 4.9 },
  { name: "Dr. James Wilson", revenue: 6900, sessions: 35, rating: 4.7 },
  { name: "Dr. Lisa Thompson", revenue: 6500, sessions: 33, rating: 4.8 },
]

export default function RevenueBreakdown() {
  const totalRevenue = revenueByService.reduce((sum, item) => sum + item.value, 0)

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Revenue Breakdown & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Revenue by Service Type */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Revenue by Service Type
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={revenueByService}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {revenueByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Performance */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Service Performance
              </Typography>
              <Box sx={{ maxHeight: 250, overflow: "auto" }}>
                {revenueByService.map((service, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${service.value.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={service.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: service.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing CVCs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Top Performing CVCs (Current Month)
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>CVC Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Revenue Generated</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Sessions Completed</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Average Rating</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCVCs.map((cvc, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {cvc.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${cvc.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>{cvc.sessions}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${cvc.rating} ⭐`}
                            size="small"
                            color={cvc.rating >= 4.8 ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={index < 2 ? "Excellent" : index < 4 ? "Good" : "Average"}
                            size="small"
                            color={index < 2 ? "success" : index < 4 ? "primary" : "default"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Revenue Summary (Current Month)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#4F5B93" }}>
                      ${totalRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#82ca9d" }}>
                      ${Math.round(totalRevenue * 0.7).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CVC Earnings (70%)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#ffc658" }}>
                      ${Math.round(totalRevenue * 0.3).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Platform Revenue (30%)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#ff7c7c" }}>
                      185
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sessions
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
