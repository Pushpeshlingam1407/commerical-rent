import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Button, Card, CardContent,
  Chip, CircularProgress, Alert
} from '@mui/material';
import { Add, TrendingUp, AttachMoney, Warning } from '@mui/icons-material';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeLeases: 0,
    totalRevenue: 0,
    pendingDisputes: 0,
  });
  const [properties, setProperties] = useState<any[]>([]);
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
      
      const [propsRes, leasesRes, paymentsRes] = await Promise.all([
        api.get('/properties'),
        api.get('/leases'),
        api.get('/rent-payments')
      ]);

      const ownerProps = propsRes.data.filter((p: any) => p.ownerId === user.id);
      const ownerLeases = leasesRes.data.filter((l: any) =>
        ownerProps.some((p: any) => p.id === l.propertyId)
      );
      const ownerPayments = paymentsRes.data.filter((payment: any) =>
        ownerLeases.some((l: any) => l.id === payment.leaseAgreementId)
      );

      const totalRevenue = ownerPayments
        .filter((p: any) => p.paymentStatus === 'PAID')
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      setProperties(ownerProps.slice(0, 5));
      setStats({
        totalProperties: ownerProps.length,
        activeLeases: ownerLeases.length,
        totalRevenue,
        pendingDisputes: 0,
      });
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setProperties([]);
      setStats({
        totalProperties: 0,
        activeLeases: 0,
        totalRevenue: 0,
        pendingDisputes: 0,
      });
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage your commercial properties and track performance
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Add Property
        </Button>
      </Box>

      {error && !loading && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: '#4F46E5', fontSize: '2rem' }}><AttachMoney /></Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Properties</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {loading ? '...' : stats.totalProperties}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: '#10B981', fontSize: '2rem' }}><TrendingUp /></Box>
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
            <Box sx={{ color: '#F59E0B', fontSize: '2rem' }}><AttachMoney /></Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Monthly Revenue</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹{loading ? '...' : stats.totalRevenue.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: '#EF4444', fontSize: '2rem' }}><Warning /></Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Pending Issues</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {loading ? '...' : stats.pendingDisputes}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Recent Properties */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Properties</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : properties.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>No properties listed yet</Typography>
            <Button variant="contained" startIcon={<Add />}>List Your First Property</Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            {properties.map((property) => (
              <Card key={property.id} elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'all 0.2s', '&:hover': { boxShadow: 'var(--shadow-md)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {property.propertyName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {property.location}
                      </Typography>
                    </Box>
                    <Chip
                      label={property.availabilityStatus}
                      size="small"
                      color={property.availabilityStatus === 'AVAILABLE' ? 'success' : 'default'}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700, my: 2 }}>
                    ₹{property.monthlyRentAmount?.toLocaleString() || 0}/month
                  </Typography>
                  <Button fullWidth variant="outlined" size="small">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
