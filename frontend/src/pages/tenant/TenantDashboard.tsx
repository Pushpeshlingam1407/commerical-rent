import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Description, Payment, HomeWork } from '@mui/icons-material';
import { StatCard } from '../../components/StatCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeLeases: 0,
    totalPaid: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) return;
        
        // Use generic GET /leases if backend doesn't properly support /leases/tenant/{id} as string vs number
        const leasesRes = await api.get('/leases');
        const tenantLeases = leasesRes.data.filter((l: any) => l.tenant?.id === user.id);

        const paymentsRes = await api.get('/payments');
        const tenantPayments = paymentsRes.data.filter((payment: any) => 
          tenantLeases.some((l: any) => l.id === payment.leaseAgreementId)
        );

        const totalPaid = tenantPayments
          .filter((p: any) => p.paymentStatus === 'PAID')
          .reduce((sum: number, p: any) => sum + p.amount, 0);

        const pendingPayments = tenantPayments
          .filter((p: any) => p.paymentStatus === 'INITIATED' || p.paymentStatus === 'OVERDUE')
          .length;

        setStats({
          activeLeases: tenantLeases.filter((l: any) => l.leaseStatus === 'ACTIVE').length,
          totalPaid: totalPaid,
          pendingPayments: pendingPayments,
        });
      } catch (error) {
        console.error('Failed to load tenant stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
        Tenant Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your active leases and rent payments.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3 }}>
        <StatCard title="Active Leases" value={stats.activeLeases} icon={<Description fontSize="large" />} color="#10B981" loading={loading} />
        <StatCard title="Total Rent Paid" value={`$${stats.totalPaid.toLocaleString()}`} icon={<Payment fontSize="large" />} color="#4F46E5" loading={loading} />
        <StatCard title="Pending Payments" value={stats.pendingPayments} icon={<HomeWork fontSize="large" />} color="#F59E0B" loading={loading} />
      </Box>
    </Box>
  );
};
