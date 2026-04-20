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
import { TrendingUp, Description, CheckCircle, Schedule, WarningAmber, DoneAll } from "@mui/icons-material";
import api from "../../utils/api";
import { toast } from "react-toastify";

export const LeaseAnalytics: React.FC = () => {
  const [stats, setStats] = useState({
    totalLeases: 0,
    activeLeases: 0,
    pendingApprovals: 0,
    terminatedLeases: 0,
    totalRevenue: 0,
    averageRent: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leases");
      const allLeases = res.data;

      const totalLeases = allLeases.length;
      const activeLeases = allLeases.filter((l: any) => l.leaseStatus === "ACTIVE").length;
      const pendingApprovals = allLeases.filter((l: any) => l.leaseStatus === "REQUESTED").length;
      const terminatedLeases = allLeases.filter((l: any) => l.leaseStatus === "TERMINATED").length;
      const totalRevenue = allLeases
        .filter((l: any) => l.leaseStatus === "ACTIVE")
        .reduce((sum: number, l: any) => sum + (l.monthlyRentAmount || 0), 0);
      const averageRent = activeLeases > 0 ? Math.round(totalRevenue / activeLeases) : 0;

      setStats({
        totalLeases,
        activeLeases,
        pendingApprovals,
        terminatedLeases,
        totalRevenue,
        averageRent,
      });
    } catch (error) {
      toast.error("Failed to fetch analytics");
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
          Lease Analytics & Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of lease performance and statistics
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 3, mb: 4 }}>
        <StatCard
          title="Total Leases"
          value={stats.totalLeases}
          icon={Description}
          color="var(--primary)"
        />
        <StatCard
          title="Active Leases"
          value={stats.activeLeases}
          icon={CheckCircle}
          color="#10B981"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingApprovals}
          icon={Schedule}
          color="#F59E0B"
        />
        <StatCard
          title="Terminated"
          value={stats.terminatedLeases}
          icon={WarningAmber}
          color="#EF4444"
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <Box>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <TrendingUp sx={{ color: "var(--primary)" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Revenue Metrics
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--primary)" }}>
                    ₹{stats.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((stats.totalRevenue / 100000) * 100, 100)}
                  sx={{ borderRadius: "var(--radius-md)", height: 8 }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Average Rent
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--primary)" }}>
                    ₹{stats.averageRent.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <DoneAll sx={{ color: "var(--primary)" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Status Distribution
                </Typography>
              </Box>

              <List disablePadding>
                <ListItem disableGutters sx={{ mb: 1 }}>
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
                    primary="Active"
                    secondary={`${stats.activeLeases} leases`}
                    slotProps={{
                      primary: { variant: "body2", sx: { fontWeight: 600 } },
                      secondary: { variant: "caption" }
                    }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ mb: 1 }}>
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
                    primary="Pending"
                    secondary={`${stats.pendingApprovals} requests`}
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
                        bgcolor: "#EF4444",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Terminated"
                    secondary={`${stats.terminatedLeases} leases`}
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
      </Box>

      {stats.pendingApprovals > 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          You have <strong>{stats.pendingApprovals}</strong> pending lease approvals that need attention.
        </Alert>
      )}
    </Box>
  );
};
