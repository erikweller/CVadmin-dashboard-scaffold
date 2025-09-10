"use client"

import type React from "react"

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
  Tabs,
  Tab,
} from "@mui/material"
import { Search as SearchIcon, Event as EventIcon, Refresh as RefreshIcon } from "@mui/icons-material"
import { MeetingTable } from "./MeetingTable"
import { MeetingModal } from "./MeetingModal"
import type { Meeting } from "@/lib/admin/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MeetingManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  // Build query string for API
  const queryParams = new URLSearchParams({
    query: searchQuery,
    status: statusFilter,
    type: typeFilter,
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  const { data, error, isLoading, mutate } = useSWR(`/api/admin/meetings?${queryParams}`, fetcher)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(0)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value)
    } else if (filterType === "type") {
      setTypeFilter(value)
    }
    setPage(0)
  }

  const handleCreateMeeting = () => {
    setSelectedMeeting(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMeeting(null)
    setIsCreating(false)
  }

  const handleMeetingSaved = () => {
    mutate()
    handleCloseModal()
  }

  const handleRefresh = () => {
    mutate()
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    const statusMap = ["all", "scheduled", "completed", "cancelled"]
    setStatusFilter(statusMap[newValue])
    setPage(0)
  }

  return (
    <Box>
      {/* Status Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab label="All Meetings" />
          <Tab label="Scheduled" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search meetings..."
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
                <InputLabel>Type</InputLabel>
                <Select value={typeFilter} label="Type" onChange={(e) => handleFilterChange("type", e.target.value)}>
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="group">Group</MenuItem>
                  <MenuItem value="interview">Interview</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button variant="contained" startIcon={<EventIcon />} onClick={handleCreateMeeting}>
                  Schedule Meeting
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
            {typeFilter !== "all" && (
              <Chip
                label={`Type: ${typeFilter}`}
                onDelete={() => handleFilterChange("type", "all")}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Meeting Table */}
      <MeetingTable
        meetings={data?.items || []}
        total={data?.total || 0}
        page={page}
        pageSize={pageSize}
        loading={isLoading}
        error={error}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEditMeeting={handleEditMeeting}
        onRefresh={handleRefresh}
      />

      {/* Meeting Modal */}
      <MeetingModal
        open={isModalOpen}
        meeting={selectedMeeting}
        isCreating={isCreating}
        onClose={handleCloseModal}
        onSave={handleMeetingSaved}
      />
    </Box>
  )
}
