import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
} from "@mui/material"
import {
  Person as PersonIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
} from "@mui/icons-material"

const recentActivities = [
  {
    id: 1,
    type: "user",
    title: "New user registration",
    description: "Sarah Johnson joined the platform",
    time: "2 minutes ago",
    icon: <PersonIcon />,
    color: "primary" as const,
  },
  {
    id: 2,
    type: "meeting",
    title: "Meeting completed",
    description: "Dr. Smith finished session with client",
    time: "15 minutes ago",
    icon: <EventIcon />,
    color: "success" as const,
  },
  {
    id: 3,
    type: "payout",
    title: "Payout processed",
    description: "$2,340 sent to Maria Garcia",
    time: "1 hour ago",
    icon: <PaymentIcon />,
    color: "warning" as const,
  },
  {
    id: 4,
    type: "cvc",
    title: "CVC application",
    description: "New counselor application received",
    time: "2 hours ago",
    icon: <SecurityIcon />,
    color: "info" as const,
  },
  {
    id: 5,
    type: "user",
    title: "Calendar connected",
    description: "David Chen linked Google Calendar",
    time: "3 hours ago",
    icon: <PersonIcon />,
    color: "secondary" as const,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader
        title="Recent Activity"
        subheader="Latest platform events and updates"
        action={<Chip label="Live" color="success" size="small" variant="outlined" />}
      />
      <CardContent sx={{ pt: 0 }}>
        <List disablePadding>
          {recentActivities.map((activity, index) => (
            <ListItem
              key={activity.id}
              sx={{
                px: 0,
                borderBottom: index < recentActivities.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${activity.color}.main`, width: 40, height: 40 }}>{activity.icon}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
