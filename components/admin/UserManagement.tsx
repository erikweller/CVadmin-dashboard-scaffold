"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material"
import { Search as SearchIcon, PersonAdd as PersonAddIcon, Refresh as RefreshIcon } from "@mui/icons-material"
import { UserTable } from "./UserTable"
import { UserModal } from "./UserModal"
import type { User } from "@/lib/admin/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Build query string for API
  const queryParams = new URLSearchParams({
    query: searchQuery,
    status: statusFilter,
    role: roleFilter,
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  const { data, error, isLoading, mutate } = useSWR(`/api/admin/users?${queryParams}`, fetcher)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(0) // Reset to first page when searching
  }

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value)
    } else if (filterType === "role") {
      setRoleFilter(value)
    }
    setPage(0) // Reset to first page when filtering
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    setIsCreating(false)
  }

  const handleUserSaved = () => {
    mutate() // Refresh the data
    handleCloseModal()
  }

  const handleRefresh = () => {
    mutate()
  }

  return (
    <Box>
      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select value={roleFilter} label="Role" onChange={(e) => handleFilterChange("role", e.target.value)}>
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="cvc">CVC</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleCreateUser}>
                  Add User
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Active Filters */}
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {searchQuery && (
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => handleSearch("")}
                size="small"
                variant="outlined"
              />
            )}
            {statusFilter !== "all" && (
              <Chip
                label={`Status: ${statusFilter}`}
                onDelete={() => handleFilterChange("status", "all")}
                size="small"
                variant="outlined"
              />
            )}
            {roleFilter !== "all" && (
              <Chip
                label={`Role: ${roleFilter}`}
                onDelete={() => handleFilterChange("role", "all")}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* User Table */}
      <UserTable
        users={data?.items || []}
        total={data?.total || 0}
        page={page}
        pageSize={pageSize}
        loading={isLoading}
        error={error}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEditUser={handleEditUser}
        onRefresh={handleRefresh}
      />

      {/* User Modal */}
      <UserModal
        open={isModalOpen}
        user={selectedUser}
        isCreating={isCreating}
        onClose={handleCloseModal}
        onSave={handleUserSaved}
      />
    </Box>
  )
}
