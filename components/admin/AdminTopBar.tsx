"use client"

import type React from "react"

import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, InputBase, alpha } from "@mui/material"
import { Search as SearchIcon, AccountCircle, Logout as LogoutIcon } from "@mui/icons-material"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface AdminTopBarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function AdminTopBar({ user }: AdminTopBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography variant="h6" sx={{ mr: 4, fontWeight: 600 }}>
            Admin Dashboard
          </Typography>

          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              backgroundColor: alpha("#000", 0.05),
              "&:hover": {
                backgroundColor: alpha("#000", 0.08),
              },
              marginLeft: 0,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                padding: "0 16px",
                height: "100%",
                position: "absolute",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SearchIcon sx={{ color: "text.secondary" }} />
            </Box>
            <InputBase
              placeholder="Search..."
              sx={{
                color: "inherit",
                width: "100%",
                "& .MuiInputBase-input": {
                  padding: "8px 8px 8px 0",
                  paddingLeft: `calc(1em + 32px)`,
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              {user.name?.[0] || user.email?.[0] || "A"}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <LogoutIcon sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
