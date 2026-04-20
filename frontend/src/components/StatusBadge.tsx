import React from "react";
import { Box, Typography } from "@mui/material";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "AVAILABLE":
      case "ACTIVE":
      case "APPROVED":
      case "PAID":
      case "RESOLVED":
      case "COMPLETED":
        return {
          bg: "var(--status-active)",
          color: "var(--status-active-text)",
        };
      case "REQUESTED":
      case "INITIATED":
      case "OPEN":
      case "UNDER_REVIEW":
        return {
          bg: "var(--status-pending)",
          color: "var(--status-pending-text)",
        };
      case "FAILED":
      case "OVERDUE":
      case "REJECTED":
      case "CANCELLED":
      case "TERMINATED":
      case "UNDER_MAINTENANCE":
        return { bg: "var(--status-error)", color: "var(--status-error-text)" };
      default:
        return { bg: "var(--border)", color: "var(--text-muted)" };
    }
  };

  const { bg, color } = getStatusStyles(status);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.5,
        py: 0.5,
        borderRadius: "var(--radius-xl)",
        backgroundColor: bg,
        color: color,
        fontWeight: 600,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: "bold", color: "inherit" }}
      >
        {status.replace("_", " ")}
      </Typography>
    </Box>
  );
};
