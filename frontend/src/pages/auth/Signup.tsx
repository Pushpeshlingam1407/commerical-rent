import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Paper, CircularProgress, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')
    .test('valid-email', 'Email must contain a valid domain', (value) => {
      if (!value) return false;
      const parts = value.split('@');
      if (parts.length !== 2) return false;
      const [, domain] = parts;
      return domain.includes('.') && domain.split('.').every(part => part.length > 0);
    }),
  phoneNumber: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  role: yup.string().oneOf(['TENANT', 'PROPERTY_OWNER'], 'Select a valid role').required('Role is required'),
});

type FormData = yup.InferType<typeof schema>;

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'TENANT'
    }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', data);
      const { token, user } = response.data;
      
      login(token, user);
      toast.success('Registration successful! Welcome to RentFlow.');
      navigate('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--background)', py: 4 }}>
      <Paper elevation={0} className="glass-panel hover-lift fade-in" sx={{ p: 5, maxWidth: 500, width: '100%', borderRadius: 'var(--radius-xl)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
              fontSize: '3rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              🏢
            </Box>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 0.5 }}>
            RentFlow
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Commercial Property Leasing Made Easy
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join RentFlow to manage your commercial leasing effortlessly.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-md)' } }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-md)' } }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-md)' } }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              select
              label="I am a..."
              variant="outlined"
              {...register('role')}
              error={!!errors.role}
              helperText={errors.role?.message}
              defaultValue="TENANT"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-md)' } }}
            >
              <MenuItem value="TENANT">Tenant (Looking to Rent)</MenuItem>
              <MenuItem value="PROPERTY_OWNER">Property Owner (Listing Spaces)</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-md)' } }}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 'var(--radius-md)',
              bgcolor: 'var(--primary)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-md)',
              '&:hover': { bgcolor: 'var(--primary-hover)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
