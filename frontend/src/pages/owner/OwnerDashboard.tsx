import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { HomeWork, Description, Payment } from '@mui/icons-material';
import { StatCard } from '../../components/StatCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    properties: 0,
    activeLeases: 0,
    totalRent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) return;
        // Fetch properties
        const propsRes = await api.get('/properties');
        const ownerProperties = propsRes.data.filter((p: any) => p.ownerId === user.id);
        
        // Fetch leases
        const leasesRes = await api.get('/leases');
        const ownerLeases = leasesRes.data.filter((l: any) => 
          ownerProperties.some((p: any) => p.id === l.property?.id)
        );

        // Fetch payments
        const paymentsRes = await api.get('/payments');
        const ownerPayments = paymentsRes.data.filter((payment: any) => 
          ownerLeases.some((l: any) => l.id === payment.leaseAgreementId)
        );

        const totalRent = ownerPayments
          .filter((p: any) => p.paymentStatus === 'PAID')
          .reduce((sum: number, p: any) => sum + p.amount, 0);

        setStats({
          properties: ownerProperties.length,
          activeLeases: ownerLeases.filter((l: any) => l.leaseStatus === 'ACTIVE').length,
          totalRent: totalRent,
        });
      } catch (error) {
        console.error('Failed to load owner stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
        Owner Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your properties, active leases, and rent collected.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3 }}>
        <StatCard title="My Properties" value={stats.properties} icon={<HomeWork fontSize="large" />} color="#4F46E5" loading={loading} />
        <StatCard title="Active Leases" value={stats.activeLeases} icon={<Description fontSize="large" />} color="#10B981" loading={loading} />
        <StatCard title="Total Rent Collected" value={`$${stats.totalRent.toLocaleString()}`} icon={<Payment fontSize="large" />} color="#F59E0B" loading={loading} />
      </Box>
    </Box>
  );
};
