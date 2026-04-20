import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TrendingUp, Gavel, Schedule, WarningAmber, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";

export const DisputeDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalDisputes: 0,
    pendingDisputes: 0,
    inProgressDisputes: 0,
    resolvedDisputes: 0,
    averageResolutionTime: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulating API call - replace with actual endpoint when available
      const mockDisputes = [
        { id: 1, status: "PENDING" },
        { id: 2, status: "PENDING" },
        { id: 3, status: "IN_PROGRESS" },
        { id: 4, status: "RESOLVED" },
        { id: 5, status: "RESOLVED" },
      ];

      const totalDisputes = mockDisputes.length;
      const pendingDisputes = mockDisputes.filter((d) => d.status === "PENDING").length;
      const inProgressDisputes = mockDisputes.filter((d) => d.status === "IN_PROGRESS").length;
      const resolvedDisputes = mockDisputes.filter((d) => d.status === "RESOLVED").length;

      setStats({
        totalDisputes,
        pendingDisputes,
        inProgressDisputes,
        resolvedDisputes,
        averageResolutionTime: 5,
      });
    } catch (error) {
      toast.error("Failed to fetch dispute analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: "2rem", color, opacity: 0.7 }} />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}>
          Dispute Resolution Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and resolve tenant-owner disputes
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr 1fr" }, gap: 3, mb: 4 }}>
        <StatCard
          title="Total Disputes"
          value={stats.totalDisputes}
          icon={Gavel}
          color="var(--primary)"
        />
        <StatCard
          title="Pending"
          value={stats.pendingDisputes}
          icon={Schedule}
          color="#F59E0B"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressDisputes}
          icon={WarningAmber}
          color="#EF4444"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedDisputes}
          icon={CheckCircle}
          color="#10B981"
        />
        <StatCard
          title="Avg Resolution (days)"
          value={stats.averageResolutionTime}
          icon={TrendingUp}
          color="var(--primary)"
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        {/* Dispute Status Breakdown */}
        <Box>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Gavel sx={{ color: "var(--primary)" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Status Distribution
                </Typography>
              </Box>

              <List disablePadding>
                <ListItem disableGutters sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#F59E0B",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pending Review"
                    secondary={`${stats.pendingDisputes} disputes`}
                    slotProps={{
                      primary: { variant: "body2", sx: { fontWeight: 600 } },
                      secondary: { variant: "caption" }
                    }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#EF4444",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="In Progress"
                    secondary={`${stats.inProgressDisputes} disputes`}
                    slotProps={{
                      primary: { variant: "body2", sx: { fontWeight: 600 } },
                      secondary: { variant: "caption" }
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#10B981",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Resolved"
                    secondary={`${stats.resolvedDisputes} disputes`}
                    slotProps={{
                      primary: { variant: "body2", sx: { fontWeight: 600 } },
                      secondary: { variant: "caption" }
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Resolution Metrics */}
        <Box>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <TrendingUp sx={{ color: "var(--primary)" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Performance Metrics
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Resolution Rate
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--primary)" }}>
                    {stats.totalDisputes > 0 ? Math.round((stats.resolvedDisputes / stats.totalDisputes) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.totalDisputes > 0 ? (stats.resolvedDisputes / stats.totalDisputes) * 100 : 0}
                  sx={{ borderRadius: "var(--radius-md)", height: 8 }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Avg Resolution Time
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--primary)" }}>
                  {stats.averageResolutionTime} days
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {stats.pendingDisputes > 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          You have <strong>{stats.pendingDisputes}</strong> pending disputes that need immediate attention.
        </Alert>
      )}
    </Box>
  );
};
