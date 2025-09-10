"use client"

import type React from "react"

import { useState } from "react"
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Avatar, IconButton, Menu, Alert } from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Event as EventIcon,
} from "@mui/icons-material"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface CalendarEvent {
  id: string
  title: string
  scheduledAt: string
  duration: number
  type: "individual" | "group" | "interview"
  status: "scheduled" | "completed" | "cancelled"
  cvcName?: string
  clientName?: string
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Fetch calendar events for the current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const {
    data: events = [],
    error,
    isLoading,
  } = useSWR(`/api/admin/calendar?start=${monthStart.toISOString()}&end=${monthEnd.toISOString()}`, fetcher)

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleEventMenuOpen = (event: React.MouseEvent<HTMLElement>, calendarEvent: CalendarEvent) => {
    setAnchorEl(event.currentTarget)
    setSelectedEvent(calendarEvent)
  }

  const handleEventMenuClose = () => {
    setAnchorEl(null)
    setSelectedEvent(null)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event: CalendarEvent) => isSameDay(new Date(event.scheduledAt), date))
  }

  const getEventColor = (type: string, status: string) => {
    if (status === "cancelled") return "error"
    if (status === "completed") return "success"

    switch (type) {
      case "individual":
        return "primary"
      case "group":
        return "secondary"
      case "interview":
        return "warning"
      default:
        return "default"
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">Failed to load calendar events. Please try again.</Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      {/* Calendar Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {format(currentDate, "MMMM yyyy")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" startIcon={<TodayIcon />} onClick={handleToday}>
                Today
              </Button>
              <IconButton onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={handleNextMonth}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Chip label="Individual" color="primary" size="small" variant="outlined" />
            <Chip label="Group" color="secondary" size="small" variant="outlined" />
            <Chip label="Interview" color="warning" size="small" variant="outlined" />
            <Chip label="Completed" color="success" size="small" variant="outlined" />
            <Chip label="Cancelled" color="error" size="small" variant="outlined" />
          </Box>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent>
          {/* Day Headers */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Grid item xs key={day}>
                <Typography variant="body2" sx={{ textAlign: "center", fontWeight: 600, color: "text.secondary" }}>
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid container spacing={1}>
            {days.map((day) => {
              const dayEvents = getEventsForDate(day)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())

              return (
                <Grid item xs key={day.toISOString()}>
                  <Box
                    sx={{
                      minHeight: 120,
                      p: 1,
                      border: 1,
                      borderColor: isSelected ? "primary.main" : "divider",
                      borderRadius: 1,
                      bgcolor: isToday ? "primary.50" : "background.paper",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                    onClick={() => handleDateClick(day)}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday ? 600 : 400,
                        color: isSameMonth(day, currentDate) ? "text.primary" : "text.disabled",
                        mb: 1,
                      }}
                    >
                      {format(day, "d")}
                    </Typography>

                    {/* Events for this day */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {dayEvents.slice(0, 3).map((event: CalendarEvent) => (
                        <Box
                          key={event.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            p: 0.5,
                            bgcolor: `${getEventColor(event.type, event.status)}.100`,
                            borderRadius: 0.5,
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventMenuOpen(e, event)
                          }}
                        >
                          <Avatar sx={{ width: 16, height: 16, fontSize: "0.75rem" }}>
                            <EventIcon sx={{ fontSize: 12 }} />
                          </Avatar>
                          <Typography variant="caption" sx={{ fontSize: "0.7rem", flexGrow: 1 }}>
                            {format(new Date(event.scheduledAt), "HH:mm")} {event.title.slice(0, 15)}
                            {event.title.length > 15 && "..."}
                          </Typography>
                        </Box>
                      ))}
                      {dayEvents.length > 3 && (
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                          +{dayEvents.length - 3} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Event Details Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleEventMenuClose}>
        {selectedEvent && (
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {selectedEvent.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {format(new Date(selectedEvent.scheduledAt), "MMM dd, yyyy 'at' h:mm a")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Duration: {selectedEvent.duration} minutes
            </Typography>
            <Chip
              label={selectedEvent.status}
              color={getEventColor(selectedEvent.type, selectedEvent.status)}
              size="small"
            />
          </Box>
        )}
      </Menu>
    </Box>
  )
}
