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
  Chip,
  Typography,
  Divider,
  Rating,
  OutlinedInput,
  type SelectChangeEvent,
} from "@mui/material"
import type { CVC } from "@/lib/admin/types"

interface CVCModalProps {
  open: boolean
  cvc: CVC | null
  isCreating: boolean
  onClose: () => void
  onSave: () => void
}

const specialtyOptions = [
  "Anxiety",
  "Depression",
  "Trauma",
  "Relationships",
  "Grief & Loss",
  "Addiction",
  "ADHD",
  "Bipolar Disorder",
  "Eating Disorders",
  "Family Therapy",
]

export function CVCModal({ open, cvc, isCreating, onClose, onSave }: CVCModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialties: [] as string[],
    status: "pending" as CVC["status"],
    rating: 0,
    bio: "",
    experience: "",
    education: "",
    certifications: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cvc) {
      setFormData({
        name: cvc.name,
        email: cvc.email,
        specialties: cvc.specialties,
        status: cvc.status,
        rating: cvc.rating || 0,
        bio: "",
        experience: "",
        education: "",
        certifications: "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        specialties: [],
        status: "pending",
        rating: 0,
        bio: "",
        experience: "",
        education: "",
        certifications: "",
      })
    }
    setError(null)
  }, [cvc, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isCreating ? "/api/admin/cvcs" : `/api/admin/cvcs/${cvc?.id}`
      const method = isCreating ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save CVC")
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

  const handleSpecialtyChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      specialties: typeof value === "string" ? value.split(",") : value,
    }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isCreating ? "Add New CVC" : "CVC Profile"}</DialogTitle>
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
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={!isCreating}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={formData.status} label="Status" onChange={(e) => handleChange("status", e.target.value)}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography component="legend" variant="body2" sx={{ mb: 1 }}>
                  Rating
                </Typography>
                <Rating
                  value={formData.rating}
                  onChange={(_, newValue) => handleChange("rating", newValue || 0)}
                  precision={0.5}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Specialties
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Specialties</InputLabel>
                <Select
                  multiple
                  value={formData.specialties}
                  onChange={handleSpecialtyChange}
                  input={<OutlinedInput label="Specialties" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {specialtyOptions.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Professional Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Brief professional bio..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g., 5 years"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Education"
                value={formData.education}
                onChange={(e) => handleChange("education", e.target.value)}
                placeholder="e.g., PhD in Psychology"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certifications"
                multiline
                rows={2}
                value={formData.certifications}
                onChange={(e) => handleChange("certifications", e.target.value)}
                placeholder="List relevant certifications..."
              />
            </Grid>

            {/* Performance Metrics (for existing CVCs) */}
            {!isCreating && cvc && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Performance Metrics
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: "center", p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                    <Typography variant="h4" color="primary.main">
                      {cvc.totalSessions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sessions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: "center", p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                    <Typography variant="h4" color="success.main">
                      ${(cvc.totalEarnings / 100).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Earnings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: "center", p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                    <Typography variant="h4" color="warning.main">
                      {cvc.rating || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
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
            {loading ? "Saving..." : isCreating ? "Create CVC" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
