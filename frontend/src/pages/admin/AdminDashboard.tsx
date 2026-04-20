import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { People, HomeWork, Description, Gavel } from '@mui/icons-material';
import api from '../../utils/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    leases: 0,
    disputes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, propsRes, leasesRes, disputesRes] = await Promise.all([
          api.get('/users'),
          api.get('/properties'),
          api.get('/leases'),
          api.get('/disputes')
        ]);
        
        setStats({
          users: usersRes.data.length || 0,
          properties: propsRes.data.length || 0,
          leases: leasesRes.data.length || 0,
          disputes: disputesRes.data.length || 0
        });
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Paper elevation={0} className="hover-lift" sx={{ p: 3, borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
      <Box sx={{ p: 2, borderRadius: 'var(--radius-lg)', bgcolor: `${color}15`, color: color, mr: 3 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        System overview and global statistics.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3 }}>
        <StatCard title="Total Users" value={stats.users} icon={<People fontSize="large" />} color="#4F46E5" />
        <StatCard title="Properties" value={stats.properties} icon={<HomeWork fontSize="large" />} color="#10B981" />
        <StatCard title="Active Leases" value={stats.leases} icon={<Description fontSize="large" />} color="#F59E0B" />
        <StatCard title="Open Disputes" value={stats.disputes} icon={<Gavel fontSize="large" />} color="#EF4444" />
      </Box>
    </Box>
  );
};
