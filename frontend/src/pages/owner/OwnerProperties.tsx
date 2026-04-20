import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, TextField, MenuItem, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../utils/api';

interface Property {
  id: number;
  propertyName: string;
  location: string;
  propertyType: string;
  monthlyRentAmount: number;
  availabilityStatus: string;
  createdAt: string;
}

const propertySchema = yup.object().shape({
  propertyName: yup.string().required('Property name is required').min(3, 'Min 3 characters'),
  location: yup.string().required('Location is required').min(3, 'Min 3 characters'),
  propertyType: yup.string().required('Property type is required'),
  monthlyRentAmount: yup.number().required('Rent amount is required').positive('Must be positive'),
  availabilityStatus: yup.string().required('Status is required').oneOf(['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE']),
});

type PropertyFormData = yup.InferType<typeof propertySchema>;

export const OwnerProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/properties');
      setProperties(res.data || []);
    } catch (err) {
      toast.error('Failed to load properties');
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

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (editingId) {
        await api.put(`/properties/${editingId}`, data);
        toast.success('Property updated successfully');
      } else {
        await api.post('/properties', { ...data, ownerId: 1 }); // Mock owner ID
        toast.success('Property created successfully');
      }
      setOpenDialog(false);
      reset();
      setEditingId(null);
      fetchProperties();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this property?')) {
      try {
        await api.delete(`/properties/${id}`);
        toast.success('Property deleted');
        fetchProperties();
      } catch (err) {
        toast.error('Failed to delete property');
      }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>My Properties</Typography>
          <Typography variant="body2" color="text.secondary">Manage and view all your properties</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => {
          setEditingId(null);
          reset();
          setOpenDialog(true);
        }}>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--border)' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'var(--surface-hover)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Monthly Rent</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((prop) => (
                <TableRow key={prop.id} hover>
                  <TableCell>{prop.propertyName}</TableCell>
                  <TableCell>{prop.location}</TableCell>
                  <TableCell>{prop.propertyType}</TableCell>
                  <TableCell>₹{prop.monthlyRentAmount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={prop.availabilityStatus}
                      color={prop.availabilityStatus === 'AVAILABLE' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Visibility />}>View</Button>
                      <Button size="small" startIcon={<Edit />} onClick={() => {
                        setEditingId(prop.id);
                        reset(prop);
                        setOpenDialog(true);
                      }}>Edit</Button>
                      <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDelete(prop.id)}>Delete</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Property Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {editingId ? 'Edit Property' : 'Add New Property'}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="Property Name" {...register('propertyName')} error={!!errors.propertyName} helperText={errors.propertyName?.message} />
              <TextField fullWidth label="Location" {...register('location')} error={!!errors.location} helperText={errors.location?.message} />
              <TextField fullWidth label="Property Type" {...register('propertyType')} select error={!!errors.propertyType} helperText={errors.propertyType?.message}>
                <MenuItem value="COMMERCIAL">Commercial</MenuItem>
                <MenuItem value="INDUSTRIAL">Industrial</MenuItem>
                <MenuItem value="OFFICE">Office</MenuItem>
              </TextField>
              <TextField fullWidth label="Monthly Rent" type="number" {...register('monthlyRentAmount')} error={!!errors.monthlyRentAmount} helperText={errors.monthlyRentAmount?.message} />
              <TextField fullWidth label="Status" {...register('availabilityStatus')} select error={!!errors.availabilityStatus} helperText={errors.availabilityStatus?.message}>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              </TextField>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
              </Box>
            </Box>
          </form>
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
