import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading = false }) => {
  return (
    <Paper
      elevation={0}
      className="hover-lift"
      sx={{
        p: 3,
        borderRadius: "var(--radius-xl)",
        display: "flex",
        alignItems: "center",
        border: "1px solid var(--border)",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: "var(--radius-lg)",
          bgcolor: `${color}15`,
          color: color,
          mr: 3,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "var(--text-main)" }}
        >
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-muted)", fontWeight: 500 }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};
