import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const schema = yup.object().shape({
  email: yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type FormData = yup.InferType<typeof schema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      
      login(token, user);
      toast.success('Login successful! Welcome back.');
      navigate('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Invalid email or password. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--background)' }}>
      <Paper elevation={0} className="glass-panel hover-lift fade-in" sx={{ p: 5, maxWidth: 450, width: '100%', borderRadius: 'var(--radius-xl)' }}>
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your commercial properties and leases.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-md)' } }}
            />
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
              '&:hover': {
                bgcolor: 'var(--primary-hover)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 600 }}>
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
