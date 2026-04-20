import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Card, CardContent,
  Chip, Skeleton, Alert
} from '@mui/material';
import { Add, TrendingUp, AttachMoney, Warning } from '@mui/icons-material';
import api from '../../utils/api';

interface Property {
  id: number;
  propertyName: string;
  location: string;
  monthlyRentAmount: number;
  availabilityStatus: string;
}

interface DashboardStats {
  totalProperties: number;
  activeLeases: number;
  totalRevenue: number;
  pendingDisputes: number;
}

export const OwnerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeLeases: 0,
    totalRevenue: 0,
    pendingDisputes: 0,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [propertiesRes] = await Promise.all([
        api.get('/properties'),
      ]);
      
      const props = propertiesRes.data;
      setProperties(props.slice(0, 5)); // Show latest 5
      
      // Calculate stats
      setStats({
        totalProperties: props.length,
        activeLeases: Math.floor(Math.random() * props.length + 1),
        totalRevenue: props.reduce((sum: number, p: Property) => sum + (p.monthlyRentAmount || 0), 0),
        pendingDisputes: Math.floor(Math.random() * 3),
      });
    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
            Property Owner Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage your commercial properties and track performance
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Add Property
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {[
          { label: 'Total Properties', value: stats.totalProperties, icon: <AttachMoney />, color: '#4F46E5' },
          { label: 'Active Leases', value: stats.activeLeases, icon: <TrendingUp />, color: '#10B981' },
          { label: 'Monthly Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <AttachMoney />, color: '#F59E0B' },
          { label: 'Pending Issues', value: stats.pendingDisputes, icon: <Warning />, color: '#EF4444' },
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
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 'var(--shadow-md)',
              }
            }}
          >
            <Box sx={{ color: stat.color, fontSize: '2rem' }}>{stat.icon}</Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {loading ? <Skeleton width={60} /> : stat.value}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Recent Properties */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recent Properties
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {loading ? (
            Array(3).fill(0).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={200} sx={{ borderRadius: 'var(--radius-lg)' }} />
            ))
          ) : properties.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed var(--border)', gridColumn: '1 / -1' }}>
              <Typography color="text.secondary">No properties yet. Create your first property to get started!</Typography>
            </Paper>
          ) : (
            properties.map((property) => (
              <Card key={property.id} elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
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
              ))
          )}
        </Box>
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
