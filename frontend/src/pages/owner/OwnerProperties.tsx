import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StatusBadge } from '../../components/StatusBadge';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  propertyName: yup.string().required('Property Name is required'),
  location: yup.string().required('Location is required'),
  propertyType: yup.string().required('Property Type is required'),
  monthlyRentAmount: yup.number().positive('Must be positive').required('Rent amount is required'),
});

export const OwnerProperties: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchProperties = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const res = await api.get('/properties');
      setProperties(res.data.filter((p: any) => p.ownerId === user.id));
    } catch (error) {
      toast.error('Failed to fetch your properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        ownerId: user.id,
        availabilityStatus: 'AVAILABLE'
      };
      await api.post('/properties', payload);
      toast.success('Property added successfully!');
      setOpen(false);
      reset();
      fetchProperties();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
            My Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your commercial property listings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 'var(--radius-md)',
            bgcolor: 'var(--primary)',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
            '&:hover': { bgcolor: 'var(--primary-hover)' }
          }}
        >
          Add Property
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'var(--background)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Monthly Rent</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((prop) => (
                  <TableRow key={prop.id} hover>
                    <TableCell>{prop.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{prop.propertyName}</TableCell>
                    <TableCell>{prop.location}</TableCell>
                    <TableCell>{prop.propertyType}</TableCell>
                    <TableCell>${prop.monthlyRentAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={prop.availabilityStatus} />
                    </TableCell>
                  </TableRow>
                ))}
                {properties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        You haven't listed any properties yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 'var(--radius-lg)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border)', pb: 2 }}>
          Add New Property
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                fullWidth
                label="Property Name"
                {...register('propertyName')}
                error={!!errors.propertyName}
                helperText={errors.propertyName?.message as string}
              />
              <TextField
                fullWidth
                label="Location"
                {...register('location')}
                error={!!errors.location}
                helperText={errors.location?.message as string}
              />
              <TextField
                select
                fullWidth
                label="Property Type"
                defaultValue=""
                {...register('propertyType')}
                error={!!errors.propertyType}
                helperText={errors.propertyType?.message as string}
              >
                <MenuItem value="OFFICE">Office Space</MenuItem>
                <MenuItem value="RETAIL">Retail Store</MenuItem>
                <MenuItem value="WAREHOUSE">Warehouse</MenuItem>
                <MenuItem value="INDUSTRIAL">Industrial</MenuItem>
              </TextField>
              <TextField
                fullWidth
                type="number"
                label="Monthly Rent Amount ($)"
                {...register('monthlyRentAmount')}
                error={!!errors.monthlyRentAmount}
                helperText={errors.monthlyRentAmount?.message as string}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid var(--border)' }}>
            <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ bgcolor: 'var(--primary)', fontWeight: 600, '&:hover': { bgcolor: 'var(--primary-hover)' } }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'List Property'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
