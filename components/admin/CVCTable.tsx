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
  Rating,
  Button,
} from "@mui/material"
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import type { CVC } from "@/lib/admin/types"
import { formatDistanceToNow } from "date-fns"

interface CVCTableProps {
  cvcs: CVC[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: any
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEditCVC: (cvc: CVC) => void
  onScheduleInterview: (cvc: CVC) => void
  onRefresh: () => void
}

export function CVCTable({
  cvcs,
  total,
  page,
  pageSize,
  loading,
  error,
  onPageChange,
  onPageSizeChange,
  onEditCVC,
  onScheduleInterview,
  onRefresh,
}: CVCTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedCVC, setSelectedCVC] = useState<CVC | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, cvc: CVC) => {
    setAnchorEl(event.currentTarget)
    setSelectedCVC(cvc)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedCVC(null)
  }

  const handleApprove = async (cvc: CVC) => {
    try {
      const response = await fetch(`/api/admin/cvcs/${cvc.id}/approve`, {
        method: "POST",
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error approving CVC:", error)
    }
    handleMenuClose()
  }

  const handleReject = async (cvc: CVC) => {
    try {
      const response = await fetch(`/api/admin/cvcs/${cvc.id}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error rejecting CVC:", error)
    }
    handleMenuClose()
  }

  const getStatusChip = (status: CVC["status"]) => {
    const statusConfig = {
      pending: { label: "Pending", color: "warning" as const },
      approved: { label: "Approved", color: "success" as const },
      rejected: { label: "Rejected", color: "error" as const },
      suspended: { label: "Suspended", color: "error" as const },
    }

    const config = statusConfig[status]
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const getSpecialtyChips = (specialties: string[]) => {
    return (
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
        {specialties.slice(0, 2).map((specialty) => (
          <Chip key={specialty} label={specialty} size="small" variant="outlined" />
        ))}
        {specialties.length > 2 && <Chip label={`+${specialties.length - 2}`} size="small" variant="outlined" />}
      </Box>
    )
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
          <Alert severity="error">Failed to load CVCs. Please try again.</Alert>
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
              <TableCell>CVC</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialties</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Sessions</TableCell>
              <TableCell>Earnings</TableCell>
              <TableCell>Applied</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cvcs.map((cvc) => (
              <TableRow key={cvc.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>{cvc.name[0]}</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {cvc.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {cvc.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{cvc.email}</TableCell>
                <TableCell>{getSpecialtyChips(cvc.specialties)}</TableCell>
                <TableCell>{getStatusChip(cvc.status)}</TableCell>
                <TableCell>
                  {cvc.rating ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating value={cvc.rating} readOnly size="small" />
                      <Typography variant="caption">({cvc.rating})</Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No rating
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{cvc.totalSessions}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">${(cvc.totalEarnings / 100).toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDistanceToNow(new Date(cvc.applicationDate), { addSuffix: true })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {cvc.status === "pending" && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" variant="contained" color="success" onClick={() => handleApprove(cvc)}>
                        Approve
                      </Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleReject(cvc)}>
                        Reject
                      </Button>
                    </Box>
                  )}
                  <IconButton onClick={(e) => handleMenuOpen(e, cvc)}>
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
        <MenuItem onClick={() => selectedCVC && onEditCVC(selectedCVC)}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={() => selectedCVC && onEditCVC(selectedCVC)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit CVC
        </MenuItem>
        {selectedCVC?.status === "pending" && (
          <>
            <MenuItem onClick={() => selectedCVC && onScheduleInterview(selectedCVC)}>
              <ScheduleIcon sx={{ mr: 1 }} />
              Schedule Interview
            </MenuItem>
            <MenuItem onClick={() => selectedCVC && handleApprove(selectedCVC)}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              Approve
            </MenuItem>
            <MenuItem onClick={() => selectedCVC && handleReject(selectedCVC)}>
              <CancelIcon sx={{ mr: 1 }} />
              Reject
            </MenuItem>
          </>
        )}
      </Menu>
    </Card>
  )
}
