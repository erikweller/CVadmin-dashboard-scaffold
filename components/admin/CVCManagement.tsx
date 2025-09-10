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
import { Search as SearchIcon, PersonAdd as PersonAddIcon, Refresh as RefreshIcon } from "@mui/icons-material"
import { CVCTable } from "./CVCTable"
import { CVCModal } from "./CVCModal"
import { InterviewScheduler } from "./InterviewScheduler"
import type { CVC } from "@/lib/admin/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CVCManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [selectedCVC, setSelectedCVC] = useState<CVC | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [interviewCVC, setInterviewCVC] = useState<CVC | null>(null)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)

  // Build query string for API
  const queryParams = new URLSearchParams({
    query: searchQuery,
    status: statusFilter,
    specialty: specialtyFilter,
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  const { data, error, isLoading, mutate } = useSWR(`/api/admin/cvcs?${queryParams}`, fetcher)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(0)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value)
    } else if (filterType === "specialty") {
      setSpecialtyFilter(value)
    }
    setPage(0)
  }

  const handleCreateCVC = () => {
    setSelectedCVC(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleEditCVC = (cvc: CVC) => {
    setSelectedCVC(cvc)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleScheduleInterview = (cvc: CVC) => {
    setInterviewCVC(cvc)
    setIsInterviewModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCVC(null)
    setIsCreating(false)
  }

  const handleCloseInterviewModal = () => {
    setIsInterviewModalOpen(false)
    setInterviewCVC(null)
  }

  const handleCVCSaved = () => {
    mutate()
    handleCloseModal()
  }

  const handleInterviewScheduled = () => {
    mutate()
    handleCloseInterviewModal()
  }

  const handleRefresh = () => {
    mutate()
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    // Update status filter based on tab
    const statusMap = ["all", "pending", "approved", "rejected"]
    setStatusFilter(statusMap[newValue])
    setPage(0)
  }

  return (
    <Box>
      {/* Status Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab label="All CVCs" />
          <Tab label="Pending Applications" />
          <Tab label="Approved CVCs" />
          <Tab label="Rejected Applications" />
        </Tabs>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search CVCs..."
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
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={specialtyFilter}
                  label="Specialty"
                  onChange={(e) => handleFilterChange("specialty", e.target.value)}
                >
                  <MenuItem value="all">All Specialties</MenuItem>
                  <MenuItem value="anxiety">Anxiety</MenuItem>
                  <MenuItem value="depression">Depression</MenuItem>
                  <MenuItem value="trauma">Trauma</MenuItem>
                  <MenuItem value="relationships">Relationships</MenuItem>
                  <MenuItem value="grief">Grief & Loss</MenuItem>
                  <MenuItem value="addiction">Addiction</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleCreateCVC}>
                  Add CVC
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
            {specialtyFilter !== "all" && (
              <Chip
                label={`Specialty: ${specialtyFilter}`}
                onDelete={() => handleFilterChange("specialty", "all")}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* CVC Table */}
      <CVCTable
        cvcs={data?.items || []}
        total={data?.total || 0}
        page={page}
        pageSize={pageSize}
        loading={isLoading}
        error={error}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEditCVC={handleEditCVC}
        onScheduleInterview={handleScheduleInterview}
        onRefresh={handleRefresh}
      />

      {/* CVC Modal */}
      <CVCModal
        open={isModalOpen}
        cvc={selectedCVC}
        isCreating={isCreating}
        onClose={handleCloseModal}
        onSave={handleCVCSaved}
      />

      {/* Interview Scheduler Modal */}
      <InterviewScheduler
        open={isInterviewModalOpen}
        cvc={interviewCVC}
        onClose={handleCloseInterviewModal}
        onScheduled={handleInterviewScheduled}
      />
    </Box>
  )
}
