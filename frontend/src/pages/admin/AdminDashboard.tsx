import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { People, HomeWork, Description, Gavel } from "@mui/icons-material";
import { StatCard } from "../../components/StatCard";
import api from "../../utils/api";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    leases: 0,
    disputes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, propsRes, leasesRes, disputesRes] = await Promise.all([
          api.get("/users"),
          api.get("/properties"),
          api.get("/leases"),
          api.get("/disputes"),
        ]);

        setStats({
          users: usersRes.data.length || 0,
          properties: propsRes.data.length || 0,
          leases: leasesRes.data.length || 0,
          disputes: disputesRes.data.length || 0,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box className="fade-in">
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "var(--primary)", mb: 1 }}
      >
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        System overview and global statistics.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 3,
        }}
      >
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<People fontSize="large" />}
          color="#4F46E5"
        />
        <StatCard
          title="Properties"
          value={stats.properties}
          icon={<HomeWork fontSize="large" />}
          color="#10B981"
        />
        <StatCard
          title="Active Leases"
          value={stats.leases}
          icon={<Description fontSize="large" />}
          color="#F59E0B"
        />
        <StatCard
          title="Open Disputes"
          value={stats.disputes}
          icon={<Gavel fontSize="large" />}
          color="#EF4444"
        />
      </Box>
    </Box>
  );
};
