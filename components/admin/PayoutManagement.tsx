"use client"

import React from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
} from "@mui/material"
import { MoreVert, Payment, Schedule, CheckCircle, Cancel } from "@mui/icons-material"

interface Payout {
  id: string
  cvcName: string
  cvcEmail: string
  amount: number
  period: string
  status: "pending" | "processing" | "completed" | "failed"
  requestDate: string
  scheduledDate: string
}

const mockPayouts: Payout[] = [
  {
    id: "1",
    cvcName: "Dr. Sarah Johnson",
    cvcEmail: "sarah.johnson@email.com",
    amount: 2850,
    period: "May 2024",
    status: "pending",
    requestDate: "2024-06-01",
    scheduledDate: "2024-06-15",
  },
  {
    id: "2",
    cvcName: "Dr. Michael Chen",
    cvcEmail: "michael.chen@email.com",
    amount: 3200,
    period: "May 2024",
    status: "processing",
    requestDate: "2024-06-01",
    scheduledDate: "2024-06-15",
  },
  {
    id: "3",
    cvcName: "Dr. Emily Rodriguez",
    cvcEmail: "emily.rodriguez@email.com",
    amount: 2650,
    period: "May 2024",
    status: "completed",
    requestDate: "2024-05-01",
    scheduledDate: "2024-05-15",
  },
]

export default function PayoutManagement() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedPayout, setSelectedPayout] = React.useState<Payout | null>(null)
  const [payoutDialog, setPayoutDialog] = React.useState(false)
  const [payouts, setPayouts] = React.useState(mockPayouts)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, payout: Payout) => {
    setAnchorEl(event.currentTarget)
    setSelectedPayout(payout)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedPayout(null)
  }

  const handleStatusChange = (status: Payout["status"]) => {
    if (selectedPayout) {
      setPayouts((prev) => prev.map((p) => (p.id === selectedPayout.id ? { ...p, status } : p)))
    }
    handleMenuClose()
  }

  const getStatusColor = (status: Payout["status"]) => {
    switch (status) {
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "completed":
        return "success"
      case "failed":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: Payout["status"]) => {
    switch (status) {
      case "pending":
        return <Schedule />
      case "processing":
        return <Payment />
      case "completed":
        return <CheckCircle />
      case "failed":
        return <Cancel />
      default:
        return null
    }
  }

  const totalPending = payouts.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  const totalProcessing = payouts.filter((p) => p.status === "processing").reduce((sum, p) => sum + p.amount, 0)

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Payout Management
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "#4F5B93", "&:hover": { bgcolor: "#3d4674" } }}
          onClick={() => setPayoutDialog(true)}
        >
          Process Batch Payout
        </Button>
      </Box>

      {/* Payout Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Pending Payouts
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#f57c00" }}>
                ${totalPending.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Processing Payouts
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
                ${totalProcessing.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Next Payout Date
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                June 15, 2024
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payouts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>CVC</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Request Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scheduled Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payout.cvcName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payout.cvcEmail}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ${payout.amount.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>{payout.period}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(payout.status)}
                    label={payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    color={getStatusColor(payout.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(payout.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(payout.scheduledDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, payout)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleStatusChange("processing")}>Mark as Processing</MenuItem>
        <MenuItem onClick={() => handleStatusChange("completed")}>Mark as Completed</MenuItem>
        <MenuItem onClick={() => handleStatusChange("failed")}>Mark as Failed</MenuItem>
      </Menu>

      {/* Batch Payout Dialog */}
      <Dialog open={payoutDialog} onClose={() => setPayoutDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Batch Payout</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Process all pending payouts for the selected period.
          </Typography>
          <TextField fullWidth label="Payout Period" value="May 2024" sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Total Amount"
            value={`$${totalPending.toLocaleString()}`}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Processing Date"
            type="date"
            defaultValue="2024-06-15"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayoutDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#4F5B93", "&:hover": { bgcolor: "#3d4674" } }}
            onClick={() => setPayoutDialog(false)}
          >
            Process Payouts
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
