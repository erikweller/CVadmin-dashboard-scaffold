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
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Box,
} from "@mui/material"
import type { User } from "@/lib/admin/types"

interface UserModalProps {
  open: boolean
  user: User | null
  isCreating: boolean
  onClose: () => void
  onSave: () => void
}

export function UserModal({ open, user, isCreating, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
        role: user.role || "user",
        active: user.active,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "user",
        active: true,
      })
    }
    setError(null)
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isCreating ? "/api/admin/users" : `/api/admin/users/${user?.id}`
      const method = isCreating ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save user")
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isCreating ? "Create New User" : "Edit User"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={!isCreating} // Don't allow email changes for existing users
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={formData.role} label="Role" onChange={(e) => handleChange("role", e.target.value)}>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="cvc">CVC</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ pt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch checked={formData.active} onChange={(e) => handleChange("active", e.target.checked)} />
                  }
                  label="Active Account"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : isCreating ? "Create User" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
