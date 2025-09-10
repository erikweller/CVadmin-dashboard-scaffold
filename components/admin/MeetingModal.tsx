"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Box,
  Typography,
  Divider,
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import type { Meeting } from "@/lib/admin/types"

interface MeetingModalProps {
  open: boolean
  meeting: Meeting | null
  isCreating: boolean
  onClose: () => void
  onSave: () => void
}

export function MeetingModal({ open, meeting, isCreating, onClose, onSave }: MeetingModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    cvcId: "",
    clientId: "",
    scheduledAt: new Date(),
    duration: 60,
    type: "individual" as Meeting["type"],
    status: "scheduled" as Meeting["status"],
    notes: "",
    meetingLink: "",
    revenue: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title,
        cvcId: meeting.cvcId,
        clientId: meeting.clientId,
        scheduledAt: new Date(meeting.scheduledAt),
        duration: meeting.duration,
        type: meeting.type,
        status: meeting.status,
        notes: "",
        meetingLink: "",
        revenue: meeting.revenue,
      })
    } else {
      setFormData({
        title: "",
        cvcId: "",
        clientId: "",
        scheduledAt: new Date(),
        duration: 60,
        type: "individual",
        status: "scheduled",
        notes: "",
        meetingLink: "",
        revenue: 0,
      })
    }
    setError(null)
  }, [meeting, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isCreating ? "/api/admin/meetings" : `/api/admin/meetings/${meeting?.id}`
      const method = isCreating ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scheduledAt: formData.scheduledAt.toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save meeting")
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{isCreating ? "Schedule New Meeting" : "Edit Meeting"}</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Meeting Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  placeholder="e.g., Anxiety Management Session"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVC ID"
                  value={formData.cvcId}
                  onChange={(e) => handleChange("cvcId", e.target.value)}
                  required
                  placeholder="CVC identifier"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client ID"
                  value={formData.clientId}
                  onChange={(e) => handleChange("clientId", e.target.value)}
                  required
                  placeholder="Client identifier"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Scheduling
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Scheduled Date & Time"
                  value={formData.scheduledAt}
                  onChange={(newValue) => newValue && handleChange("scheduledAt", newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  minDateTime={new Date()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={formData.duration}
                    label="Duration"
                    onChange={(e) => handleChange("duration", e.target.value)}
                  >
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={45}>45 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={90}>1.5 hours</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Meeting Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Meeting Type"
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <MenuItem value="individual">Individual Session</MenuItem>
                    <MenuItem value="group">Group Session</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="no-show">No Show</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Additional Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Meeting Link"
                  value={formData.meetingLink}
                  onChange={(e) => handleChange("meetingLink", e.target.value)}
                  placeholder="Video call link"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Revenue (cents)"
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => handleChange("revenue", Number.parseInt(e.target.value) || 0)}
                  placeholder="Revenue in cents"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Additional notes or preparation instructions..."
                />
              </Grid>

              {/* Meeting Summary (for existing meetings) */}
              {!isCreating && meeting && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Meeting Summary
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                      <Typography variant="h6" color="primary.main">
                        {meeting.duration} min
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                      <Typography variant="h6" color="success.main">
                        ${(meeting.revenue / 100).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Revenue
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                      <Typography variant="h6" color="info.main">
                        {meeting.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Session Type
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Saving..." : isCreating ? "Schedule Meeting" : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  )
}
