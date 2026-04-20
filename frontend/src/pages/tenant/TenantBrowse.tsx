import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Card, CardContent, Typography, Button,
  Chip, TextField, MenuItem, Skeleton, Dialog
} from '@mui/material';
import { LocationOn, Favorite, FavoriteBorder } from '@mui/icons-material';
import api from '../../utils/api';

interface Property {
  id: number;
  propertyName: string;
  location: string;
  propertyType: string;
  monthlyRentAmount: number;
  availabilityStatus: string;
}

export const TenantBrowse: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState({
    propertyType: '',
    minRent: '',
    maxRent: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);
import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Card, CardContent, CardActions, 
  Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import { LocationOn, AttachMoney, Business } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  leaseStartDate: yup.string().required('Start date is required'),
  leaseEndDate: yup.string().required('End date is required'),
  securityDeposit: yup.number().positive('Must be positive').required('Security deposit is required'),
});

export const TenantBrowse: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/properties');
      setProperties(res.data.filter((p: Property) => p.availabilityStatus === 'AVAILABLE'));
    } catch (err) {
      console.error(err);
      // Only show available properties
      setProperties(res.data.filter((p: any) => p.availabilityStatus === 'AVAILABLE'));
    } catch (error) {
      toast.error('Failed to fetch available properties');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredProperties = properties.filter(p => {
    if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
    if (filters.minRent && p.monthlyRentAmount < parseInt(filters.minRent)) return false;
    if (filters.maxRent && p.monthlyRentAmount > parseInt(filters.maxRent)) return false;
    return true;
  });

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Browse Available Properties</Typography>

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', mb: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              label="Property Type"
              select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="COMMERCIAL">Commercial</MenuItem>
              <MenuItem value="INDUSTRIAL">Industrial</MenuItem>
              <MenuItem value="OFFICE">Office</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Min Rent (₹)"
              type="number"
              value={filters.minRent}
              onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
            />
            <TextField
              fullWidth
              label="Max Rent (₹)"
              type="number"
              value={filters.maxRent}
              onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
            />
            <Button variant="contained" fullWidth onClick={() => setFilters({ propertyType: '', minRent: '', maxRent: '' })}>
              Reset
            </Button>
          </Box>
        </Paper>

        {/* Results */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredProperties.length} properties found
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {loading ? (
            Array(6).fill(0).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={300} sx={{ borderRadius: 'var(--radius-lg)' }} />
            ))
          ) : filteredProperties.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed var(--border)', gridColumn: '1 / -1' }}>
              <Typography color="text.secondary">No properties match your filters</Typography>
            </Paper>
          ) : (
            filteredProperties.map((property) => (
              <Card
                key={property.id}
                elevation={0}
                sx={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-md)',
                  }
                  }}
                >
                  <CardContent sx={{ pb: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {property.propertyName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {property.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        startIcon={favorites.includes(property.id) ? <Favorite /> : <FavoriteBorder />}
                        onClick={() => toggleFavorite(property.id)}
                        color={favorites.includes(property.id) ? 'error' : 'inherit'}
                      />
                    </Box>

                    <Box sx={{ my: 3 }}>
                      <Chip label={property.propertyType} size="small" variant="outlined" sx={{ mr: 1 }} />
                      <Chip label={property.availabilityStatus} size="small" color="success" />
                    </Box>

                    <Typography variant="h5" sx={{ color: 'var(--primary)', fontWeight: 700, my: 2 }}>
                      ₹{property.monthlyRentAmount?.toLocaleString()}/month
                    </Typography>
                  </CardContent>

                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        setSelectedProperty(property);
                        setOpenDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              ))
          )}
        </Box>
      </Box>

      {/* Property Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        {selectedProperty && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {selectedProperty.propertyName}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Location</Typography>
                <Typography>{selectedProperty.location}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Type</Typography>
                <Typography>{selectedProperty.propertyType}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Monthly Rent</Typography>
                <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
                  ₹{selectedProperty.monthlyRentAmount?.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenDetails(false)}>Close</Button>
              <Button fullWidth variant="contained">Request Lease</Button>
            </Box>
          </Box>
        )}
  useEffect(() => {
    fetchProperties();
  }, []);

  const handleRequestLease = (property: any) => {
    setSelectedProperty(property);
  };

  const onSubmit = async (data: any) => {
    if (!user || !selectedProperty) return;
    setSubmitting(true);
    try {
      const payload = {
        propertyId: selectedProperty.id,
        tenantId: user.id,
        leaseStartDate: data.leaseStartDate,
        leaseEndDate: data.leaseEndDate,
        monthlyRentAmount: selectedProperty.monthlyRentAmount,
        securityDeposit: data.securityDeposit,
        leaseStatus: 'REQUESTED'
      };
      
      await api.post('/leases', payload);
      toast.success('Lease requested successfully!');
      setSelectedProperty(null);
      reset();
      fetchProperties();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request lease');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
        Browse Properties
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Find and request leases for available commercial spaces.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {properties.map((prop) => (
            <Box key={prop.id}>
              <Card 
                elevation={0} 
                className="hover-lift"
                sx={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-lg)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {prop.propertyName}
                    </Typography>
                    <Chip label={prop.propertyType} size="small" sx={{ bgcolor: 'var(--primary)', color: 'white', fontWeight: 500 }} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                    <LocationOn fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{prop.location}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                    <Business fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">Commercial {prop.propertyType.toLowerCase()}</Typography>
                  </Box>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'var(--background)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center' }}>
                    <AttachMoney color="success" />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {prop.monthlyRentAmount.toLocaleString()}
                      <Typography component="span" variant="body2" color="text.secondary"> / mo</Typography>
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => handleRequestLease(prop)}
                    sx={{ 
                      bgcolor: 'var(--primary)', 
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 'var(--radius-md)',
                      '&:hover': { bgcolor: 'var(--primary-hover)' }
                    }}
                  >
                    Request Lease
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
          {properties.length === 0 && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <Typography variant="body1" color="text.secondary">
                  No properties are currently available. Check back later!
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      )}

      {/* Request Lease Modal */}
      <Dialog open={!!selectedProperty} onClose={() => setSelectedProperty(null)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 'var(--radius-lg)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border)', pb: 2 }}>
          Request Lease Agreement
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
              Requesting lease for: <strong>{selectedProperty?.propertyName}</strong> at ${selectedProperty?.monthlyRentAmount}/month.
            </Typography>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Lease Start Date"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('leaseStartDate')}
                error={!!errors.leaseStartDate}
                helperText={errors.leaseStartDate?.message as string}
              />
              <TextField
                fullWidth
                type="date"
                label="Lease End Date"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('leaseEndDate')}
                error={!!errors.leaseEndDate}
                helperText={errors.leaseEndDate?.message as string}
              />
              <TextField
                fullWidth
                type="number"
                label="Proposed Security Deposit ($)"
                {...register('securityDeposit')}
                error={!!errors.securityDeposit}
                helperText={errors.securityDeposit?.message as string}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid var(--border)' }}>
            <Button onClick={() => setSelectedProperty(null)} color="inherit" sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ bgcolor: 'var(--primary)', fontWeight: 600, '&:hover': { bgcolor: 'var(--primary-hover)' } }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
