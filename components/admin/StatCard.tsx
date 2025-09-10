import { Card, CardContent, Typography, Box, Chip } from "@mui/material"
import { TrendingUp, TrendingDown } from "@mui/icons-material"

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  trend?: string
  trendUp?: boolean
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning"
}

export default function StatCard({ title, value, subtitle, trend, trendUp, color = "primary" }: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: `${color}.main` }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
          {trend && (
            <Chip
              icon={trendUp ? <TrendingUp /> : <TrendingDown />}
              label={trend}
              size="small"
              color={trendUp ? "success" : "error"}
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
