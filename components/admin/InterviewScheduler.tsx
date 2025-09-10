"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import type { CVC } from "@/lib/admin/types"

interface InterviewSchedulerProps {
  open: boolean
  cvc: CVC | null
  onClose: () => void
  onScheduled: () => void
}

export function InterviewScheduler({ open, cvc, onClose, onScheduled }: InterviewSchedulerProps) {
  const [formData, setFormData] = useState({
    date: new Date(),
    time: new Date(),
    duration: 60,
    type: "video",
    notes: "",
    interviewer: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Combine date and time
      const scheduledDateTime = new Date(formData.date)
      scheduledDateTime.setHours(formData.time.getHours())
      scheduledDateTime.setMinutes(formData.time.getMinutes())

      const response = await fetch("/api/admin/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvcId: cvc?.id,
          scheduledAt: scheduledDateTime.toISOString(),
          duration: formData.duration,
          type: formData.type,
          notes: formData.notes,
          interviewer: formData.interviewer,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to schedule interview")
      }

      onScheduled()
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
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Schedule CVC Interview</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {cvc && (
              <Box sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                <Typography variant="h6">{cvc.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {cvc.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Specialties: {cvc.specialties.join(", ")}
                </Typography>
              </Box>
            )}

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Interview Date"
                  value={formData.date}
                  onChange={(newValue) => newValue && handleChange("date", newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  minDate={new Date()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Interview Time"
                  value={formData.time}
                  onChange={(newValue) => newValue && handleChange("time", newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
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
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Interview Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Interview Type"
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <MenuItem value="video">Video Call</MenuItem>
                    <MenuItem value="phone">Phone Call</MenuItem>
                    <MenuItem value="in-person">In Person</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Interviewer"
                  value={formData.interviewer}
                  onChange={(e) => handleChange("interviewer", e.target.value)}
                  placeholder="Name of the interviewer"
                  required
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  )
}
