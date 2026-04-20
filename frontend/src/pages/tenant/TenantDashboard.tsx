import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Card, CardContent,
  Chip, Skeleton, Alert
} from '@mui/material';
import { Receipt, CheckCircle, AttachMoney } from '@mui/icons-material';

interface Lease {
  id: number;
  propertyName: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRentAmount: number;
  leaseStatus: string;
}

interface Payment {
  id: number;
  amount: number;
  paymentStatus: string;
  paymentMonth: string;
  paymentDate?: string;
}

export const TenantDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalLeases: 0,
    activeLeases: 0,
    paidThisMonth: 0,
    pendingPayments: 0,
  });
  const [leases, setLeases] = useState<Lease[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data since we don't have tenant-specific endpoints yet
      setStats({
        totalLeases: 2,
        activeLeases: 1,
        paidThisMonth: 15000,
        pendingPayments: 35000,
      });
      setLeases([
        {
          id: 1,
          propertyName: 'Downtown Office',
          leaseStartDate: '2024-01-15',
          leaseEndDate: '2025-01-14',
          monthlyRentAmount: 15000,
          leaseStatus: 'ACTIVE',
        }
      ]);
      setPayments([
        { id: 1, amount: 15000, paymentStatus: 'PAID', paymentMonth: '2024-04', paymentDate: '2024-04-01' },
        { id: 2, amount: 15000, paymentStatus: 'PENDING', paymentMonth: '2024-05' },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
          Tenant Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of your leases and rental payments
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {[
          { label: 'Total Leases', value: stats.totalLeases, icon: <Receipt />, color: '#4F46E5' },
          { label: 'Active Leases', value: stats.activeLeases, icon: <CheckCircle />, color: '#10B981' },
          { label: 'Paid This Month', value: `₹${stats.paidThisMonth.toLocaleString()}`, icon: <AttachMoney />, color: '#F59E0B' },
          { label: 'Pending Payments', value: `₹${stats.pendingPayments.toLocaleString()}`, icon: <Receipt />, color: '#EF4444' },
        ].map((stat, idx) => (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
            }}
            >
              <Box sx={{ color: stat.color, fontSize: '2rem' }}>{stat.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {loading ? <Skeleton width={80} /> : stat.value}
                </Typography>
              </Box>
            </Paper>
        ))}
      </Box>

      {/* Active Leases */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Active Leases</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {loading ? (
            Array(2).fill(0).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={150} sx={{ borderRadius: 'var(--radius-lg)' }} />
            ))
          ) : leases.length === 0 ? (
            <Alert severity="info">No active leases. Browse properties to start renting.</Alert>
          ) : (
            leases.map((lease) => (
              <Card key={lease.id} elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{lease.propertyName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lease.leaseStartDate} to {lease.leaseEndDate}
                      </Typography>
                    </Box>
                    <Chip label={lease.leaseStatus} color="success" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
                      ₹{lease.monthlyRentAmount?.toLocaleString()}/month
                    </Typography>
                    <Button variant="outlined" size="small">Pay Rent</Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
          )}
        </Box>
      </Box>

      {/* Recent Payments */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Payments</Typography>
        <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          {payments.map((payment, idx) => (
            <Box
              key={payment.id}
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: idx < payments.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Payment for {payment.paymentMonth}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {payment.paymentDate ? `Paid on ${payment.paymentDate}` : 'Due soon'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                  ₹{payment.amount?.toLocaleString()}
                </Typography>
                <Chip
                  size="small"
                  label={payment.paymentStatus}
                  color={payment.paymentStatus === 'PAID' ? 'success' : 'warning'}
                />
              </Box>
            </Box>
          ))}
        </Paper>
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
