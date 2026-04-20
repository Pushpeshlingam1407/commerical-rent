import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, Chip, Button, CircularProgress, Alert } from '@mui/material';
import { Receipt, CheckCircle, AttachMoney, CreditCard, Gavel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeLeases: 0,
    totalPaid: 0,
    pendingPayments: 0,
  });
  const [leases, setLeases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (!user) return;
      setError('');
      setLoading(true);

      // Fetch leases and payments
      const [leasesRes, paymentsRes] = await Promise.all([
        api.get('/leases'),
        api.get('/rent-payments')
      ]);

      const tenantLeases = leasesRes.data.filter((l: any) => 
        l.tenant === user?.email && (l.leaseStatus === 'APPROVED' || l.leaseStatus === 'ACTIVE')
      );
      const tenantPayments = paymentsRes.data.filter((p: any) => 
        tenantLeases.some((l: any) => l.id === p.leaseAgreementId)
      );

      const totalPaid = tenantPayments
        .filter((p: any) => p.paymentStatus === 'PAID')
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const pendingPayments = tenantPayments
        .filter((p: any) => p.paymentStatus === 'PENDING' || p.paymentStatus === 'OVERDUE')
        .length;

      setStats({
        activeLeases: tenantLeases.length,
        totalPaid,
        pendingPayments,
      });

      setLeases(tenantLeases);
      setPayments(tenantPayments.sort((a: any, b: any) => 
        new Date(b.paymentMonth).getTime() - new Date(a.paymentMonth).getTime()
      ));
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError('Failed to load dashboard data');
      console.error(error);
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of your leases and rental payments
        </Typography>
      </Box>

      {error && !loading && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: '#4F46E5', fontSize: '2rem' }}><Receipt /></Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Active Leases</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {loading ? '...' : stats.activeLeases}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: '#10B981', fontSize: '2rem' }}><CheckCircle /></Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Paid</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹{loading ? '...' : stats.totalPaid.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: '#EF4444', fontSize: '2rem' }}><AttachMoney /></Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Pending Payments</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {loading ? '...' : stats.pendingPayments}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Active Leases */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Active Leases</Typography>
          <Button 
            startIcon={<Gavel />}
            variant="outlined"
            size="small"
            onClick={() => navigate('/tenant/disputes')}
          >
            View Disputes
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : leases.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>No active leases yet</Typography>
            <Button 
              variant="contained"
              onClick={() => navigate('/tenant/browse')}
            >
              Browse Properties
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {leases.map((lease) => (
              <Card key={lease.id} elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'all 0.2s', '&:hover': { boxShadow: 'var(--shadow-md)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {lease.property?.propertyName || 'Property'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lease.leaseStartDate} to {lease.leaseEndDate}
                      </Typography>
                    </Box>
                    <Chip 
                      label={lease.leaseStatus} 
                      color={lease.leaseStatus === 'ACTIVE' ? 'success' : 'default'} 
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
                      ₹{lease.monthlyRentAmount?.toLocaleString()}/month
                    </Typography>
                    <Button variant="outlined" size="small" startIcon={<CreditCard />}>
                      Pay Rent
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Recent Payments */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Payments</Typography>
        <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={40} />
            </Box>
          ) : payments.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No payment history yet</Typography>
            </Box>
          ) : (
            payments.map((payment, idx) => (
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
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Payment for {payment.paymentMonth}
                  </Typography>
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
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
};
