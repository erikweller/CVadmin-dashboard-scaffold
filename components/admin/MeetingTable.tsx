"use client"

import type React from "react"

import { useState } from "react"
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material"
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material"
import type { Meeting } from "@/lib/admin/types"
import { format } from "date-fns"

interface MeetingTableProps {
  meetings: Meeting[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: any
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEditMeeting: (meeting: Meeting) => void
  onRefresh: () => void
}

export function MeetingTable({
  meetings,
  total,
  page,
  pageSize,
  loading,
  error,
  onPageChange,
  onPageSizeChange,
  onEditMeeting,
  onRefresh,
}: MeetingTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, meeting: Meeting) => {
    setAnchorEl(event.currentTarget)
    setSelectedMeeting(meeting)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedMeeting(null)
  }

  const handleUpdateStatus = async (meeting: Meeting, status: Meeting["status"]) => {
    try {
      const response = await fetch(`/api/admin/meetings/${meeting.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error updating meeting status:", error)
    }
    handleMenuClose()
  }

  const getStatusChip = (status: Meeting["status"]) => {
    const statusConfig = {
      scheduled: { label: "Scheduled", color: "info" as const },
      completed: { label: "Completed", color: "success" as const },
      cancelled: { label: "Cancelled", color: "error" as const },
      "no-show": { label: "No Show", color: "warning" as const },
    }

    const config = statusConfig[status]
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const getTypeChip = (type: Meeting["type"]) => {
    const typeConfig = {
      individual: { label: "Individual", color: "primary" as const },
      group: { label: "Group", color: "secondary" as const },
    }

    const config = typeConfig[type]
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />
  }

  if (loading) {
    return (
      <Card>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">Failed to load meetings. Please try again.</Alert>
        </Box>
      </Card>
    )
  }

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Meeting</TableCell>
              <TableCell>CVC</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meetings.map((meeting) => (
              <TableRow key={meeting.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {meeting.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {meeting.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>{meeting.cvcId[0]}</Avatar>
                    <Typography variant="body2">{meeting.cvcId}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>{meeting.clientId[0]}</Avatar>
                    <Typography variant="body2">{meeting.clientId}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{getTypeChip(meeting.type)}</TableCell>
                <TableCell>{getStatusChip(meeting.status)}</TableCell>
                <TableCell>
                  <Typography variant="body2">{format(new Date(meeting.scheduledAt), "MMM dd, yyyy")}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(meeting.scheduledAt), "h:mm a")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{meeting.duration} min</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">${(meeting.revenue / 100).toFixed(2)}</Typography>
                </TableCell>
                <TableCell align="right">
                  {meeting.status === "scheduled" && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateStatus(meeting, "completed")}
                      >
                        Complete
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleUpdateStatus(meeting, "cancelled")}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                  <IconButton onClick={(e) => handleMenuOpen(e, meeting)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(Number.parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => selectedMeeting && onEditMeeting(selectedMeeting)}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => selectedMeeting && onEditMeeting(selectedMeeting)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Meeting
        </MenuItem>
        {selectedMeeting?.status === "scheduled" && (
          <>
            <MenuItem onClick={() => console.log("Join meeting")}>
              <VideoCallIcon sx={{ mr: 1 }} />
              Join Meeting
            </MenuItem>
            <MenuItem onClick={() => selectedMeeting && handleUpdateStatus(selectedMeeting, "completed")}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              Mark Complete
            </MenuItem>
            <MenuItem onClick={() => selectedMeeting && handleUpdateStatus(selectedMeeting, "cancelled")}>
              <CancelIcon sx={{ mr: 1 }} />
              Cancel Meeting
            </MenuItem>
          </>
        )}
      </Menu>
    </Card>
  )
}
