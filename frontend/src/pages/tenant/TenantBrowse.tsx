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
      setProperties(res.data.filter((p: any) => p.availabilityStatus === 'AVAILABLE'));
    } catch (error: any) {
      toast.error('Failed to fetch available properties');
    } finally {
      setLoading(false);
    }
  };

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
        property: selectedProperty.propertyName,
        tenant: user.email,
        leaseStartDate: data.leaseStartDate,
        leaseEndDate: data.leaseEndDate,
        monthlyRentAmount: selectedProperty.monthlyRentAmount,
        securityDeposit: data.securityDeposit,
        approvedBy: "PENDING",
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
