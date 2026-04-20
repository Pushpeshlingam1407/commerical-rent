import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, Dialog, TextField, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { Download, Send, CheckCircle, AccessTime, Warning } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../utils/api';

interface RentPayment {
  id: number;
  leaseAgreement?: { propertyName: string };
  amount: number;
  paymentMonth: string;
  paymentDate?: string;
  paymentStatus: string;
  penaltyAmount?: number;
  referenceId?: string;
}

export const TenantPayments: React.FC = () => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rent-payments');
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import { Payment } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StatusBadge } from '../../components/StatusBadge';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  leaseAgreementId: yup.number().required('Select a lease'),
  amount: yup.number().positive('Must be positive').required('Amount is required'),
  paymentMonth: yup.string().required('Payment month is required'),
});

export const TenantPayments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [activeLeases, setActiveLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
      if (!user) return;
      setLoading(true);
      
      const leasesRes = await api.get('/leases');
      const tenantLeases = leasesRes.data.filter((l: any) => l.tenant?.id === user.id);
      setActiveLeases(tenantLeases.filter((l: any) => l.leaseStatus === 'ACTIVE'));

      const paymentsRes = await api.get('/payments');
      const tenantPayments = paymentsRes.data.filter((payment: any) => 
        tenantLeases.some((l: any) => l.id === payment.leaseAgreementId)
      );
      setPayments(tenantPayments);
    } catch (error) {
      toast.error('Failed to fetch payments data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment || !paymentMethod || !transactionId) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await api.put(`/rent-payments/${selectedPayment.id}`, {
        ...selectedPayment,
        paymentStatus: 'PAID',
        paymentDate: new Date().toISOString().split('T')[0],
        referenceId: transactionId,
      });
      toast.success('Payment recorded successfully');
      setOpenPayment(false);
      setPaymentMethod('');
      setTransactionId('');
      fetchPayments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle sx={{ color: 'var(--success)' }} />;
      case 'PENDING':
        return <AccessTime sx={{ color: 'var(--warning)' }} />;
      case 'OVERDUE':
        return <Warning sx={{ color: 'var(--danger)' }} />;
      default:
        return null;
    }
  };

  const stats = {
    totalDue: payments.filter(p => p.paymentStatus !== 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0),
    totalPaid: payments.filter(p => p.paymentStatus === 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0),
    pendingCount: payments.filter(p => p.paymentStatus === 'PENDING' || p.paymentStatus === 'OVERDUE').length,
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Payment History</Typography>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
          {[
            { label: 'Total Paid', value: `₹${stats.totalPaid.toLocaleString()}`, icon: '✓', color: '#10B981' },
            { label: 'Amount Due', value: `₹${stats.totalDue.toLocaleString()}`, icon: '!', color: '#EF4444' },
            { label: 'Pending Payments', value: stats.pendingCount, icon: '⏱', color: '#F59E0B' },
          ].map((stat, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: stat.color }}>
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Warnings */}
        {stats.pendingCount > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You have {stats.pendingCount} pending payment(s). Please process them at the earliest.
          </Alert>
        )}

        {/* Payments Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--border)' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'var(--surface-hover)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Paid Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', p: 4 }}>
                      No payment records found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>{payment.leaseAgreement?.propertyName || 'N/A'}</TableCell>
                      <TableCell>{payment.paymentMonth}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{payment.amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>{payment.paymentDate || '—'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(payment.paymentStatus)}
                          <Chip
                            size="small"
                            label={payment.paymentStatus}
                            color={payment.paymentStatus === 'PAID' ? 'success' : payment.paymentStatus === 'OVERDUE' ? 'error' : 'warning'}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {payment.paymentStatus !== 'PAID' && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Send />}
                              onClick={() => {
                                setSelectedPayment(payment);
                                setOpenPayment(true);
                              }}
                            >
                              Pay
                            </Button>
                          )}
                          <Button size="small" startIcon={<Download />}>
                            Invoice
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
  useEffect(() => {
    fetchData();
  }, [user]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'PAID'
      };
      await api.post('/payments', payload);
      toast.success('Payment submitted successfully!');
      setOpen(false);
      reset();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
            My Payments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your payment history and pay rent.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Payment />}
          onClick={() => setOpen(true)}
          disabled={activeLeases.length === 0}
          sx={{
            borderRadius: 'var(--radius-md)',
            bgcolor: 'var(--primary)',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
            '&:hover': { bgcolor: 'var(--primary-hover)' }
          }}
        >
          Pay Rent
        </Button>
      </Box>

      {activeLeases.length === 0 && !loading && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'var(--status-pending)', color: 'var(--status-pending-text)', borderRadius: 'var(--radius-md)' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            You do not have any active leases. Rent payment is disabled until a lease is approved.
          </Typography>
        </Paper>
      )}

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
                  <TableCell sx={{ fontWeight: 600 }}>Lease ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment Month</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date Paid</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Penalty</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.leaseAgreementId}</TableCell>
                    <TableCell>{payment.paymentMonth}</TableCell>
                    <TableCell>{payment.paymentDate || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: payment.penaltyAmount > 0 ? 'var(--status-error-text)' : 'inherit' }}>
                      ${payment.penaltyAmount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.paymentStatus} />
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No payment history found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Payment Dialog */}
      <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Record Payment</Typography>
          {selectedPayment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Amount to Pay</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--primary)', mt: 1 }}>
                  ₹{selectedPayment.amount?.toLocaleString()}
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Payment Method"
                select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Transaction ID / Reference"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
                <Button variant="contained" onClick={handlePayment}>Confirm Payment</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Pay Rent Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 'var(--radius-lg)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border)', pb: 2 }}>
          Submit Rent Payment
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                select
                fullWidth
                label="Select Active Lease"
                defaultValue=""
                {...register('leaseAgreementId')}
                error={!!errors.leaseAgreementId}
                helperText={errors.leaseAgreementId?.message as string}
              >
                {activeLeases.map((lease) => (
                  <MenuItem key={lease.id} value={lease.id}>
                    Lease #{lease.id} - {lease.property?.propertyName || 'Property'} (${lease.monthlyRentAmount}/mo)
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="date"
                label="Payment Month (Any day of the month)"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('paymentMonth')}
                error={!!errors.paymentMonth}
                helperText={errors.paymentMonth?.message as string}
              />
              <TextField
                fullWidth
                type="number"
                label="Payment Amount ($)"
                {...register('amount')}
                error={!!errors.amount}
                helperText={errors.amount?.message as string}
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
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
