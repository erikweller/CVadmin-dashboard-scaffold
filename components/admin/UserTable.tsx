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
} from "@mui/material"
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import type { User } from "@/lib/admin/types"
import { formatDistanceToNow } from "date-fns"

interface UserTableProps {
  users: User[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: any
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEditUser: (user: User) => void
  onRefresh: () => void
}

export function UserTable({
  users,
  total,
  page,
  pageSize,
  loading,
  error,
  onPageChange,
  onPageSizeChange,
  onEditUser,
  onRefresh,
}: UserTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleToggleActive = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/toggle-active`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
    handleMenuClose()
  }

  const handleResetPassword = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: "POST",
      })

      if (response.ok) {
        // Show success message
        console.log("Password reset email sent")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
    }
    handleMenuClose()
  }

  const getStatusChip = (user: User) => {
    if (user.active) {
      return <Chip label="Active" color="success" size="small" />
    }
    return <Chip label="Inactive" color="error" size="small" />
  }

  const getRoleChip = (role?: string) => {
    const roleColors: Record<string, "default" | "primary" | "secondary"> = {
      admin: "primary",
      cvc: "secondary",
      user: "default",
    }

    return (
      <Chip label={role?.toUpperCase() || "USER"} color={roleColors[role || "user"]} size="small" variant="outlined" />
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
          <Alert severity="error">Failed to load users. Please try again.</Alert>
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
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Sign In</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>{user.name?.[0] || user.email[0]}</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.name || "No name"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleChip(user.role)}</TableCell>
                <TableCell>{getStatusChip(user)}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.lastSignIn ? formatDistanceToNow(new Date(user.lastSignIn), { addSuffix: true }) : "Never"}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, user)}>
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
        <MenuItem onClick={() => selectedUser && onEditUser(selectedUser)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => selectedUser && handleToggleActive(selectedUser)}>
          {selectedUser?.active ? <BlockIcon sx={{ mr: 1 }} /> : <CheckCircleIcon sx={{ mr: 1 }} />}
          {selectedUser?.active ? "Deactivate" : "Activate"}
        </MenuItem>
        <MenuItem onClick={() => selectedUser && handleResetPassword(selectedUser)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Reset Password
        </MenuItem>
      </Menu>
    </Card>
  )
}
