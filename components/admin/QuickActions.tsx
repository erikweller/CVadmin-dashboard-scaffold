"use client"

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  PersonAdd as PersonAddIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"

const quickActions = [
  {
    title: "Add New User",
    description: "Create a new user account",
    icon: <PersonAddIcon />,
    path: "/admin/users?action=create",
    color: "primary" as const,
  },
  {
    title: "Review CVC Applications",
    description: "3 pending applications",
    icon: <SecurityIcon />,
    path: "/admin/cvcs?filter=pending",
    color: "warning" as const,
  },
  {
    title: "Schedule Interview",
    description: "Book CVC interview meeting",
    icon: <EventIcon />,
    path: "/admin/calendar?action=schedule",
    color: "info" as const,
  },
  {
    title: "Process Payouts",
    description: "8 payouts awaiting approval",
    icon: <PaymentIcon />,
    path: "/admin/payouts?filter=pending",
    color: "success" as const,
  },
]

export function QuickActions() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader title="Quick Actions" subheader="Common administrative tasks" />
      <CardContent sx={{ pt: 0 }}>
        <List disablePadding>
          {quickActions.map((action, index) => (
            <ListItem
              key={action.title}
              sx={{
                px: 0,
                borderBottom: index < quickActions.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <ListItemIcon sx={{ color: `${action.color}.main` }}>{action.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {action.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {action.description}
                  </Typography>
                }
              />
              <Button size="small" color={action.color} onClick={() => router.push(action.path)} sx={{ ml: 1 }}>
                Go
              </Button>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => router.push("/admin/settings")}
          >
            System Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
